/*===================================================================
=            Exporter - Data exporter for transect maker            =
===================================================================*/

var Exporter = function(){
	this.PRECISION = 4; // percent
	this.STEPS = Math.round(100/this.PRECISION); 
}

/* Take the list of polygons and group them with respect to
their transect. In case a polygon is shared over multiple 
transects split the polygon at the reference wells that divide 
the polygon */

Exporter.prototype.export = function() {
	this.polygons = transectApp.PolygonsCollection;
	this.transects = transectApp.TransectsCollection;
	this.initialize();
	this.processData();
}

/* Initialize dictionary to store transect specific data */

Exporter.prototype.initialize = function() {
	var self = this;
	self.transectsData = {};
	transectApp.TransectsCollection.each(function(transect) {
		self.transectsData[transect.get('id')] = {
			data: transect, 
			polygons: [],
			points: new Points(),
			texts: new TransectTexts(),
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
	var polygons = [polygon.get('points')];

	for (var index=0; index < transects.length; index++) {
		var transect = transects.at(index);
		var transectId = transect.get('id');
		var currPolygonPoints = polygons.pop();

		var currPolygon = {
			name: polygon.get('name'),
			pattern: polygon.get('patternName'),
			points: new Points(),
			lines: new Lines(),
		}

		var rightWellLine = self.getLineSegmentForWell(transect.get('wellRight')).getPolyKPointsArray();
		
		if (index !== numberOfTransects - 1) {
			// if the transect is not the last transect we split the polygon using
			// the right well. This will generate two new polygons. One polygon lies
			// in the current transect an the other lies in the next transect.
			// we update the current transect and push the next transect on the stack
			// for next iteration.
			var polyPoints = currPolygonPoints.getPolyKPointsArray();
			
			if (PolyK.GetArea(polyPoints) > 0) {
				polyPoints = PolyK.Reverse(polyPoints);
			}

			var polygonSlices = PolyK.Slice(
				polyPoints, rightWellLine[0], 
				rightWellLine[1], rightWellLine[2], rightWellLine[3]);

			var polygonSlices = self.getPolygonsFromPolyKPolygonsArray(polygonSlices);
			polygonSlices.forEach(function(slice) {
				polygons.push(slice);
			});

			currPolygonPoints = polygonSlices[0];
		}

		currPolygon.points.add(currPolygonPoints.toArray());
		var polygonLines = self.generatePolygonLines(currPolygonPoints, polygon);
		currPolygon.lines.add(polygonLines.toArray());

		// update wells
		self.updatePointsOnWell(transect.get('wellLeft'), polygonLines, polygon);
		if (index == numberOfTransects - 1) {
			self.updatePointsOnWell(transect.get('wellRight'), polygonLines, polygon);	
		}

		// Add polygon and corresponding polygon to transect polygon
		self.transectsData[transect.get('id')].points.add(currPolygonPoints);
		self.transectsData[transect.get('id')].polygons.push(currPolygon);

		// update matrix
		self.updateTransectMatrix(transect, currPolygonPoints);
	}
}

Exporter.prototype.updateTransectMatrix = function(transect, polygonPoints) {
	var self = this;
	var matrix = self.transectsData[transect.get('id')].matrix;
	polygonPoints.each(function(point) {
		var age = String(point.get('age'));
		var percent = Math.round((point.get('relativeX')*100)/self.PRECISION)*self.PRECISION;
		
		if (point.get('transect') !== transect) {
			percent = 100;
		}

		if (!(age in matrix)) {
			matrix[age] = new Array(self.STEPS+1);
			for (var i=0; i <= self.STEPS; i++) {
				matrix[age][i] = " ";
			}
		}
		matrix[age][percent/self.PRECISION] = point.get('name');
	});
}

Exporter.prototype.updatePointsOnWell = function(well, polygonLines, polygon) {
	var self = this;
	polygonLines.each(function(line) {
		if (self.isCloseToWell(well, line)	) {
			if (line.get('point1').get('y') < line.get('point2').get('y')) {
				self.wellsData[well.get('id')].referencePoints.push({
					point: line.get('point1'),
					pattern: "TOP",
				});
				self.wellsData[well.get('id')].referencePoints.push({
					point: line.get('point2'),
					pattern: polygon.get('patternName') || "None",
					name: polygon.get('name'),
				});
			} else {
				self.wellsData[well.get('id')].referencePoints.push({
					point: line.get('point2'),
					pattern: "TOP",
				});
				self.wellsData[well.get('id')].referencePoints.push({
					point: line.get('point1'),
					pattern: polygon.get('patternName') || "None",
					name: polygon.get('name'),
				});
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

Exporter.prototype.generatePolygonLines = function(polygonPoints, origPolygon) {
	var self = this;
	// generate new lines for the sliced polygon 
	// check if the line is part of original lines of polygon 
	// get the line's pattern
	var lines = new Lines();
	polygonPoints.each(function(point, index) {
		if (index > 0) {
			var line = new Line({}, polygonPoints.at(index - 1), point);
			self.updateLineStyleFromOriginalPolygon(line, origPolygon);
			lines.add(line);
		}
	});

	// last line connects the last point and the first point thus closing the 
	// polygon.
	var lastLine = new Line({}, polygonPoints.last(), polygonPoints.first());
	self.updateLineStyleFromOriginalPolygon(lastLine, origPolygon);
	lines.add(lastLine);

	return lines;
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
	return new Line({}, new Point({x: well.get('x'), y: 0}), 
		new Point({x: well.get('x'), y: transectApp.Canvas.height}));
}

Exporter.prototype.getPolygonsFromPolyKPolygonsArray = function(polygonsArray) {
	var polygons = [];
	for (var i in polygonsArray) {
		polygons.push(this.getPointsFromPolykPolygon(polygonsArray[i]));
	}
	return polygons;
}

Exporter.prototype.getPointsFromPolykPolygon = function(polyK) {
	// This will remove any duplicate points generated by the PolyK.
	var points = new Points();
	for (var i=0; i<polyK.length; i+=2) {
		var point = new Point({
			x: polyK[i],
			y: polyK[i+1],
		});
		points.add(point);
	}
	return points;
}

/*-----  End of Exporter - Data exporter for transect maker  ------*/



