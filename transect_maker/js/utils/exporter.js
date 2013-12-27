var Exporter = function(){
}

/* Initialize dictionary to store transect specific data */

Exporter.prototype.initialize = function() {
	var self = this;
	self.transects = {};
	transectApp.TransectsCollection.each(function(transect) {
		self.transects[transect.get('id')] = {
			data: transect, 
			polygons: [],
			points: new Points(),
			texts: new TransectTexts(),
			matrix: {},
		};
	});
	self.wells = {};
	transectApp.TransectWellsCollection.each(function(well) {
		self.wells[well.get('id')] = {
			data: well,
			referencePoints: {},
		}
	});
}

/* Take the list of polygons and group them with respect to
their transect. In case a polygon is shared over multiple 
transects split the polygon at the reference wells that divide 
the polygon */

Exporter.prototype.export = function() {
	this.initialize();
	transectApp.PolygonsCollection.each(this.processPolygon.bind(this));
	for (var key in this.transects) {
		this.getTransectPointMatrix(this.transects[key]);
	}
	this.updateTransectsWithTransectMatrix();
}

Exporter.prototype.updateTransectsWithTransectMatrix = function() {
	for (var id in this.transects) {
		this.transects[id]['matrix'] = this.getTransectPointMatrix(this.transects[id]);
	}
}

Exporter.prototype.getTransectPointMatrix = function(transectData) {
	var points = transectData.points;
	points.sortBy(function(point) {
		return point.get('y');
	});

	var pointsMatrix = {}

	points.each(function(point){
		var y = String(point.get('age'));
		var percent = Math.round(point.get('relativeX') * 100);
		if (!(y in pointsMatrix)) {
			pointsMatrix[y] = new Array(100);
			for (var i = 0; i < 100; i++) pointsMatrix[y][i] = " ";
		}
		pointsMatrix[y][percent] = point.get('name');
	});
	return pointsMatrix;
}

Exporter.prototype.processPolygon = function(polygon) {
	return this.generateTransectSpecificData(polygon, this.clipPolygon(polygon));
}

/* Clip polygon with respectt to the will to generate more new polygons */

Exporter.prototype.clipPolygon = function(polygon) {
	var wells = this.getWellsListForTransects(polygon);
	var polygonsArray = [polygon.getPointsArray()];
	wells.each(function(well) {
		var currPolygon = polygonsArray.pop();
		var arrays = PolyK.Slice(currPolygon,well.get('x'), 0, well.get('x'), transectApp.Canvas.height);
		arrays.forEach(function(arr) {
			if (Math.abs(PolyK.GetArea(arr)) > 0) {
				polygonsArray.push(arr);	
			}
		});
	});
	return polygonsArray;
}

Exporter.prototype.getPolygonsTransectsList = function(polygon) {
	var transects = new Transects();
	polygon.get('points').each(function(point) {
		transects.add(point.get('transect'));
	});
	var first = transectApp.TransectsCollection.length;
	var last = 0;
	transects.each(function(transect) {
		var index = transectApp.TransectsCollection.indexOf(transect);
		if (index <= first) {
			first = index;
		}

		if (index >= last) {
			last = index;
		}
	});

	var ret = new Transects();
	for (var index=first; index<=last; index++) {
		ret.add(transectApp.TransectsCollection.at(index));
	}

	return ret;
}

Exporter.prototype.getWellsListForTransects = function(polygon) {
	var transects = this.getPolygonsTransectsList(polygon);
	var wells = new TransectWells();
	transects.each(function(transect) {
		wells.add(transect.get('wellLeft'));
		wells.add(transect.get('wellRight'));
	});
	wells.sortBy(function(well){ return well.get('x'); });
	return wells;
}

Exporter.prototype.generateTransectSpecificData = function(polygon, polygonsArray) {
	var self = this;
	var transectsList = this.getPolygonsTransectsList(polygon);
	
	polygonsArray.forEach(function(polygonArray, index) {
		
		var transect = transectsList.at(index);
		var wellLeft = transect.get('wellLeft');
		var wellRight = transect.get('wellRight');
		var wellLeftPoints = new Points();
		var wellRightPoints = new Points();

		var points = new Points();
		for (var i = 0; i < polygonArray.length; i+=2) {
			x = polygonArray[i];
			y = polygonArray[i + 1];
			var point = new Point({
				name: _.uniqueId('X'),
				x: x,
				y: y
			});

			self.transects[transect.get('id')].points.add(point);
			if (point.get('relativeX') < 0.03) {
				wellLeftPoints.add(point);
			} else if (point.get('relativeX') > 0.97) {
				wellRightPoints.add(point);
			}
			points.add(point);
		}

		self.updateWellPointsPatterns(polygon, wellLeft, wellLeftPoints);
		self.updateWellPointsPatterns(polygon, wellRight, wellRightPoints);
		self.transects[transect.get('id')].polygons.push({
			name: polygon.get('name'),
			pattern: polygon.get('patternName'),
			points: points,
		});
	});
}

Exporter.prototype.updateWellPointsPatterns = function(polygon, well, wellPoints) {	
	var self = this;
	wellPoints.each(function(point, index) {
		if (index > 0) {
			var prevPoint = wellPoints.at(index - 1);
			if (PolyK.ContainsPoint(polygon.getPointsArray(), point.get('x'), (prevPoint.get('y') + point.get('y'))/2)) {
				self.wells[well.get('id')].referencePoints[point.get('name')] = {
					"pattern": polygon.get('patternName'),
					"data": point,
				};
			} else {
				self.wells[well.get('id')].referencePoints[point.get('name')] = {
					"pattern": "TOP",
					"data": point,
				};
			}
		} else {
			self.wells[well.get('id')].referencePoints[point.get('name')] = {
				"pattern": "TOP",
				"data": point,
			};
		}
	});
}

Exporter.prototype.getTransectLeftOfWell = function(well) {
	return transectApp.TransectsCollection.findWhere({
		wellRight: well,
	});
}

Exporter.prototype.getTransectRightOfWell = function(well) {
	var rightTransect = transectApp.TransectsCollection.findWhere({
		wellLeft: well,
	});
}
