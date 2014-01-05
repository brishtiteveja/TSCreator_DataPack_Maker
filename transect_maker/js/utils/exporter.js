/*===================================================================
=            Exporter - Data exporter for transect maker            =
===================================================================*/

define([
	"polygon",
	"polygons",
	"point",
	"points",
	"line",
	"lines",
	"transects",
	"transectTexts",
	"polyK"
	], function(
		Polygon,
		Polygons,
		Point,
		Points,
		Line,
		Lines,
		Transects,
		TransectTexts,
		PolyK){
	
	var Exporter = function(){
		this.PRECISION = transectApp.precision; // percent
		this.STEPS = transectApp.steps; 
	}
	/* Initialize dictionary to store transect specific data */

	Exporter.prototype.initialize = function() {
		var self = this;

		// refer to the global objects.
		this.texts = transectApp.TransectTextsCollection;
		this.polygons = transectApp.PolygonsCollection;
		this.transects = transectApp.TransectsCollection;
		this.zones = transectApp.ZonesCollection;
		this.transectImage = transectApp.TransectImage;

		// update points and texts
		transectApp.PointsCollection.updatePoints();
		this.texts.updateTransectTexts();

		// initialize the objects to store the processed data.
		// 
		self.transectsData = {};
		transectApp.TransectsCollection.each(function(transect) {
			self.transectsData[transect.get('id')] = {
				data: transect, 
				polygons: new Polygons(),
				points: new Points(),
				texts: new TransectTexts(),
				matrixPositions: [],
				matrixAges: [],
				matrix: {},
			};
		});
		self.wellsData = {};
		transectApp.TransectWellsCollection.each(function(well) {
			self.wellsData[well.get('id')] = {
				data: well,
				referencePoints: [],
			}
		});
		// Keep all the point and lines in one place to obtain previously created models.
		self.points = new Points();
		self.lines = new Lines();
	}

	/* In order to generate data in timescale creator format 
	required items are:

	1. Wells Data:
	Format: 
	<well name> \t <facies> \t <width> \t <background color>
			  \t <primary>
			  \t <pattern name> \t <polygon name> \t Age

	2. Transect Data:
	Format:
	<transect name> \t transect \t <background color> \t <on/off>
				  \t 		  \t 0 1 2 3 ...... 100
				  \t <age>      \t <poinX>

	POLGYON \t pattern: <pattern name> \t <polygon name>
			\t point 
			\t 		\t <line style>

	TEXT blah blah
	*/


	/* Take the list of polygons and group them with respect to
	their transect. In case a polygon is shared over multiple 
	transects split the polygon at the reference wells that divide 
	the polygon */

	Exporter.prototype.export = function() {
		this.initialize();
		this.processData();
		this.sortData();
		this.processTexts();
	}

	Exporter.prototype.processTexts = function() {
		var self = this;
		self.texts.each(function(text) {
			var transectId = text.get('transect').id;
			self.transectsData[transectId].texts.add(text);
		});
	}

	Exporter.prototype.sortData = function() {
		var self = this;

		for (var id in self.transectsData) {
			self.sortTransectsData(self.transectsData[id]);
		}	

		for (var id in self.wellsData) {
			self.sortWellsData(self.wellsData[id]);
		}
		
	}

	Exporter.prototype.sortTransectsData = function(transect) {
		// remove duplicates.
		transect.matrixPositions = _.uniq(transect.matrixPositions);
		transect.matrixAges = _.uniq(transect.matrixAges);
		transect.matrixPositions = _.sortBy(transect.matrixPositions, function(num){return parseInt(num);});
		transect.matrixAges = _.sortBy(transect.matrixAges, function(num){return parseFloat(num);});
	}

	Exporter.prototype.sortWellsData = function(well) {
		well.referencePoints = _.uniq(well.referencePoints);
		well.referencePoints = _.sortBy(well.referencePoints, function(referencePoint) {return referencePoint.point.get('age');});
	}


	Exporter.prototype.processData = function() {
		// process all polygons one by one
		this.polygons.each(this.processPolygon.bind(this));
	}

	Exporter.prototype.processPolygon = function(polygon) {	
		// get all the underlying transects of a polygon
		var underlyingTransects = this.getUnderlyingTransects(polygon);

		// split polygon using wells and generate a list of polygon arrays.
		this.slicePolygon(polygon, underlyingTransects);
	}

	/* A polygon can span over multiple transects. We split the
	polygon over each transect and generate new polygons specific
	to a transect. 

	getUnderlyingTransects generates the list of underlying 
	transects for the polygon.
	*/

	Exporter.prototype.getUnderlyingTransects = function(polygon) {
		// Get the list of transects base on the point of the polygon.
		// 
		var self = this;

		// Initialize array for storing transect indexes.
		// Initialize the collection to store the transects
		var underlyingTransects = new Transects();

		
		var transectIndexes = []

		// loop over all the points and store the transects in the collection.
		polygon.get('points').each(function(point) {
			var transect = point.get('transect');
			var index = self.transects.indexOf(transect);
			transectIndexes = _.union(transectIndexes, index);
		});
		
		// first and last are used for storing the indexes of the 
		// first and last transect over which the polygon spans
		// if last - first == 1 then the polygon spans over 
		// consecutive polygons. But sometimes polygons may span over
		// multiple transect as a result point may not lie in all the transects
		// so we check first and last to give the range of transects over
		// the polygon spans.
		var first = _.min(transectIndexes);
		var last = _.max(transectIndexes);

		// check if all the transects are in the collection by comparing
		// the estimated number of underlying transects and the number
		// of transects in the collection.
		for (var index=first; index<=last; index++) {
			underlyingTransects.add(self.transects.at(index));
		}

		return underlyingTransects;
	}

	/* Split polygons with respect to the transects and add appropriate point to wells. */
	Exporter.prototype.slicePolygon = function(polygon, transects) {
		var self = this;

		// We ignore the first and the last wells of the polygon.
		// as they will not split the polygon in any way.
		var numberOfTransects = transects.length;
		var polygons = new Polygons();
		var p = new Polygon()
		p.get('points').add(polygon.get('points').clone().toArray());
		p.get('lines').add(polygon.get('lines').clone().toArray());
		polygons.add(p);

		for (var index=0; index < transects.length; index++) {
			var transect = transects.at(index);

			var newPolygons = new Polygons();

			for (var i=0; i<polygons.length; i++) {

				var currPolygon = polygons.at(i); // get the current polygon

				// get the right well line and use this to split the current polygon.
				var rightWellLine = self.getLineSegmentForWell(transect.get('wellRight')).getPolyKPointsArray();
				
				// We split the polygon using the right well of the current transect.
				// This will generate new polygons, ones that lie
				// in the current transect while other lie in the next transect.
				// we update the current transect and push the next transect on the stack
				// for next iteration.
				
				var polyPoints = currPolygon.getPolyKPointsArray();
				
				if (PolyK.GetArea(polyPoints) > 0) {
					polyPoints = PolyK.Reverse(polyPoints);
				}

				var polygonSlices = PolyK.Slice(
					polyPoints, rightWellLine[0], 
					rightWellLine[1], rightWellLine[2], rightWellLine[3]);

				var polygonSlices = self.getPolygonsFromPolyKPolygonsArray(polygonSlices);
				newPolygons.add(polygonSlices.toArray());
			}

			polygons = newPolygons;
		}

		// now we have all the polygons split into smallest sub polygons
		// we process each of them separately.
		
		for (var i=0; i<polygons.length; i++) {
			var currPolygon = polygons.at(i);

			var transect = self.getTransectForPolygon(currPolygon, transects);
			
			if (transect === null) {
				continue;
			}

			var transectId = transect.get('id');

			// Update pattern
			currPolygon.set({patternName: polygon.get('patternName')});

			self.updatePolygonLines(currPolygon, polygon);

			// update wells
			self.updatePointsOnWell(transect.get('wellLeft'), currPolygon.get('lines'), polygon);
			var index = transects.toArray().indexOf(transect);
			if (index == numberOfTransects - 1) {
				self.updatePointsOnWell(transect.get('wellRight'),  currPolygon.get('lines'), polygon);	
			}

			// Add polygon and corresponding polygon to transect polygon
			self.transectsData[transectId].points.add(currPolygon.get('points'));
			self.transectsData[transectId].polygons.add(currPolygon);

			// update matrix
			self.updateTransectMatrix(transect, currPolygon);
		}
	}

	Exporter.prototype.getTransectForPolygon = function(polygon, transects) {
		// this function returns the transect to which the polygon belongs to by 
		for (var i=0; i<transects.length; i++) {
			var transect = transects.at(i);
			var poly = transect.getPolyKPointsArray();
			var hasPolygon = true;
			
			for (var j=0; j<polygon.get('points').length; j++) {
				var point = polygon.get('points').at(j);
				if (!PolyK.ContainsPoint(poly, point.get('x'), point.get('y'))) {
					hasPolygon = false;
					break;
				}
			}

			if (hasPolygon) {
				return transect;
			}
		}
		return null;
	}


	Exporter.prototype.updateTransectMatrix = function(transect, polygon) {
		var self = this;
		var polygonPoints = polygon.get('points');
		var matrix = self.transectsData[transect.get('id')].matrix;
		
		var matrixAges = self.transectsData[transect.get('id')].matrixAges;
		var matrixPositions = self.transectsData[transect.get('id')].matrixPositions;

		polygonPoints.each(function(point) {
			var age = point.get('age');
			
			var percent = self.PRECISION*Math.round(point.get('relativeX')*100/self.PRECISION);

			var pointTransect = point.get('transect');
			
			if (pointTransect !== transect) {
				if (pointTransect.get('wellLeft') === transect.get('wellRight')) {
					percent = 100;
				} else {
					percent = 0;
				}
			}

			if (!(age in matrix)) {
				matrix[String(age)] = {};
			}

			if (matrixAges.indexOf(age) < 0) {
				matrixAges.push(age);
			}

			if (matrixPositions.indexOf(age) < 0) {
				matrixPositions.push(percent);
			}

			matrix[String(age)][String(percent)] = point.get('name');
		});
	}

	Exporter.prototype.updatePointsOnWell = function(well, polygonLines, polygon) {
		var self = this;
		polygonLines.each(function(line) {
			if (self.isCloseToWell(well, line)	) {
				if (line.get('point1').get('y') < line.get('point2').get('y')) {
					if (! _.findWhere(self.wellsData[well.get('id')].referencePoints, {point: line.get('point1')})) {
						self.wellsData[well.get('id')].referencePoints.push({
							point: line.get('point1'),
							pattern: "TOP",
						});	
					}
					var refPoint = _.findWhere(self.wellsData[well.get('id')].referencePoints, {point: line.get('point2')})
					if (refPoint == undefined) {
						self.wellsData[well.get('id')].referencePoints.push({
							point: line.get('point2'),
							pattern: polygon.get('patternName') || "None",
							name: polygon.get('name'),
						});
					} else {
						var index = self.wellsData[well.get('id')].referencePoints.indexOf(refPoint);
						self.wellsData[well.get('id')].referencePoints[index].name = polygon.get('name');
						self.wellsData[well.get('id')].referencePoints[index].pattern = polygon.get('patternName') || "None";
					}
				} else {
					if (! _.findWhere(self.wellsData[well.get('id')].referencePoints, {point: line.get('point2')})) {
						self.wellsData[well.get('id')].referencePoints.push({
							point: line.get('point2'),
							pattern: "TOP",
						});
					}
					var refPoint = _.findWhere(self.wellsData[well.get('id')].referencePoints, {point: line.get('point1')})
					if (refPoint === undefined) {
						self.wellsData[well.get('id')].referencePoints.push({
							point: line.get('point1'),
							pattern: polygon.get('patternName') || "None",
							name: polygon.get('name'),
						});
					} else {
						var index = self.wellsData[well.get('id')].referencePoints.indexOf(refPoint);
						self.wellsData[well.get('id')].referencePoints[index].name = polygon.get('name');
						self.wellsData[well.get('id')].referencePoints[index].pattern = polygon.get('patternName') || "None";
					}
				}
			}
		});
	}

	Exporter.prototype.isCloseToWell = function(well, line) {
		var self = this;
		var wellLine = self.getLineSegmentForWell(well);
		var wellLinePoints = wellLine.getPolyKPointsArray();
		var PADDING = 5;
		var linePoints = [
			wellLinePoints[0] + PADDING, wellLinePoints[1],
			wellLinePoints[0] - PADDING, wellLinePoints[1],
			wellLinePoints[2] - PADDING, wellLinePoints[3],
			wellLinePoints[2] + PADDING, wellLinePoints[3],
		]
		var otherPoints = line.getPolyKPointsArray();
		if (PolyK.ContainsPoint(linePoints, otherPoints[0], otherPoints[1]) 
			&& PolyK.ContainsPoint(linePoints, otherPoints[2], otherPoints[3])) {
			return true;
		}
		return false;
	}

	Exporter.prototype.updatePolygonLines = function(polygon, origPolygon) {
		var self = this;
		// generate new lines for the sliced polygon 
		// check if the line is part of original lines of polygon 
		// get the line's pattern
		var polygonPoints = polygon.get('points');
		var lines = new Lines();
		polygonPoints.each(function(point, index) {
			if (index > 0) {
				var point1 = polygonPoints.at(index - 1);
				var point2 = point;
				var line = self.lines.findWhere({'point1': point1, 'point2': point2}) || self.lines.findWhere({'point1': point2, 'point2': point1}) || new Line({}, point1, point2);
		
				self.lines.add(line);
		
				self.updateLineStyleFromOriginalPolygon(line, origPolygon);
				polygon.get('lines').add(line);
			}
		});

		// last line connects the last point and the first point thus closing the 
		// polygon.
		
		var point1 = polygonPoints.last();
		var point2 = polygonPoints.first();
		
		var lastLine = self.lines.findWhere({'point1': point1, 'point2': point2}) || self.lines.findWhere({'point1': point2, 'point2': point1}) || new Line({}, point1, point2);
		self.lines.add(lastLine);

		self.updateLineStyleFromOriginalPolygon(lastLine, origPolygon);
		
		polygon.get('lines').add(lastLine);
	}

	Exporter.prototype.updateLineStyleFromOriginalPolygon = function(polygonLine, origPolygon) {
		var self = this;
		// check the polygon for lines that coincide with the given line
		// and update their styles.
		var lines = origPolygon.get('lines');
		for (var i = 0; i < lines.length; i++) {
			var line = lines.at(i)
			if (line.coincides(polygonLine)) {
				polygonLine.set({
					'pattern': line.get('pattern'),
				});
				break;
			}
		}
	}

	Exporter.prototype.getLineSegmentForWell = function(well) {
		var point1 = this.points.findWhere({x: Math.floor(well.get('x')), y: 0}) || new Point({x: Math.floor(well.get('x')), y: 0});
		var point2 = this.points.findWhere({x: Math.floor(well.get('x')), y: Math.floor(transectApp.Canvas.height)}) || new Point({x: Math.floor(well.get('x')), y: Math.floor(transectApp.Canvas.height)});
		
		this.points.add(point1);
		this.points.add(point2);

		var line = this.lines.findWhere({'point1': point1, 'point2': point2}) || this.lines.findWhere({'point1': point2, 'point2': point1}) || new Line({}, point1, point2);
		this.lines.add(line);	

		return line;
	}

	Exporter.prototype.getPolygonsFromPolyKPolygonsArray = function(polygonsArray) {
		var polygons = new Polygons();
		for (var i in polygonsArray) {
			polygons.add(this.getPointsFromPolykPolygon(polygonsArray[i]));
		}
		return polygons;
	}

	Exporter.prototype.getPointsFromPolykPolygon = function(polyK) {
		// This will remove any duplicate points generated by the PolyK.
		var polygon = new Polygon();
		for (var i=0; i<polyK.length; i+=2) {
			var point = this.points.findWhere({x: Math.floor(polyK[i]), y: Math.floor(polyK[i+1])}) || new Point({x: Math.floor(polyK[i]), y: Math.floor(polyK[i+1])});
			this.points.add(point);
			polygon.get('points').add(point);
		}
		return polygon;
	}

	Exporter.prototype.getText = function() {
		var self = this;
		var outputText = "";
		for (var i=0; i < self.transects.length; i++) {
			var transect = self.transects.at(i);
			if (i == 0) {
				var wellLeftId = transect.get('wellLeft').id;
				outputText += self.getWellOutputText(wellLeftId);
			}
			outputText += self.getTransectOutputText(transect.id);
			var wellRightId = transect.get('wellRight').id;
			outputText += self.getWellOutputText(wellRightId);
		}

		return outputText;
	}

	Exporter.prototype.getTransectOutputText = function(transectId) {
		var self = this;
		var transect = self.transectsData[transectId];
		var outputText = "\n\n";

		// transect header
		outputText += transect.data.get('name') + "\t";
		outputText += "transect" + "\t";
		outputText += transect.data.get('width') + "\t";
		outputText += CssToTscColor(transect.data.get('settings').get('backgroundColor')) + "\t";
		outputText += transect.data.get('status') + "\t";
		// transect matrix text
		outputText += self.getTransectMatrixText(transectId);
		// transect polygons list
		outputText += self.getTransectPolygonsListText(transectId);
		outputText += self.getTextLabelsOutput(transectId);

		return outputText;
	}

	Exporter.prototype.getTransectMatrixText = function(transectId) {
		var self = this;
		var transect = self.transectsData[transectId];
		var ages = transect.matrixAges;
		var positions = transect.matrixPositions;
		// matrix header
		var outputText = "\n\t\t";
		for (var i=0; i< positions.length; i++) {
			outputText += positions[i] + "\t";
		}


		// transect matrix
		for (var i=0; i < ages.length; i++) {
			var age = String(ages[i]);
			outputText += "\n\t";
			outputText += age + "\t";
			for (var j=0; j<positions.length; j++) {
				var position = positions[j];
				outputText += (transect.matrix[String(age)][String(position)] || "") + "\t";
			}
		}
		return outputText;
	}

	Exporter.prototype.getTransectPolygonsListText = function(transectId) {
		var self = this;
		var transect = self.transectsData[transectId];
		var outputText = "";
		// polygons list.
		for (var i=0; i<transect.polygons.length; i++) {
			var polygon = transect.polygons.at(i);
			outputText += "\n";
			outputText += "POLYGON\t";
			outputText += "pattern: " + (polygon.get('patternName') || "None") + "\t";
			outputText += (polygon.get('description') || "\t");

			var lines = polygon.get('lines');
			var points = polygon.get('points');

			for (var j=0; j<points.length; j++) {				
				var point1 = points.at(j);
				var point2 = points.at((j+1)%points.length);
				var line = lines.findWhere({'point1': point1, 'point2': point2}) || lines.findWhere({'point1': point2, 'point2': point1});
				var pattern = line.get('pattern');
				outputText += "\n\t";
				outputText += point1.get('name').substring(1);

				if (pattern !== "default") {
					outputText += "\n\t\t";
					outputText += pattern;
				}
			}
		}
		return outputText;
	}

	Exporter.prototype.getWellOutputText = function(wellId) {
		var self = this;
		var well = self.wellsData[wellId];
		var outputText = "\n\n"; // give some space before starting new well

		// well column header 
		outputText += well.data.get('name') + "\t"; // name
		outputText += "facies\t"; // column type
		outputText += well.data.get('width') + "\t";
		outputText += CssToTscColor(well.data.get('settings').get('backgroundColor')) + "\t";
		outputText + "\n"
		for (var i in well.referencePoints) {
			outputText += "\n";
			outputText += "\t"
			outputText += (well.referencePoints[i].pattern || "None") + "\t";
			outputText += (well.referencePoints[i].name || "") + "\t";
			outputText += well.referencePoints[i].point.get('age') + "\t";
			outputText += "CALIBRATION = ";
			outputText += Math.round((well.referencePoints[i].point.get('relativeY')*1000))/10
			outputText += " " + well.referencePoints[i].point.get('zone').get('name') + "\t";
		}
		return outputText;
	}

	Exporter.prototype.getTextLabelsOutput = function(transectId) {
		var output = "";
		var texts = this.transectsData[transectId].texts;
		texts.each(function(text) {
			var bBox = text.get('bBox');
			var textData = text.get('text').split('\n').join('');
			var fontFamily = text.get('settings').get('fontFamily').split(",")[0];
			output += "\n";
			output += "TEXT\t" + bBox.y1 + "\t" + bBox.x1;
			output += "\t" + textData;
			output += "\tfont-family: " + fontFamily + "; font-size: " + text.get('settings').get('fontSize') + ";";
			output += "\t" + bBox.y2 + "\t" + bBox.x2;
		});
		return output;
	}


	Exporter.prototype.getJSON = function() {
		var json = {};
		json["transects"] = this.transects.toJSON();
		json["zones"] = this.zones.toJSON();
		json["polygons"] = this.polygons.toJSON();
		json["texts"] = this.texts.toJSON();
		json["image"] = this.transectImage.toJSON();
		return JSON.stringify(json);
	}

	return Exporter;

});

/*-----  End of Exporter - Data exporter for transect maker  ------*/



