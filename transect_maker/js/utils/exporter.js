var Exporter = function(){
	this.initialize();
}

/* Initialize dictionary to store transect specific data */

Exporter.prototype.initialize = function() {
	self.transects = {};
	transectApp.TransectsCollection.each(function(transect) {
		self.transects[transect.get('id')] = {
			data: transect, 
			polygons: [],
			points: new PointsCollection(),
			texts: new TransectTextsCollection(),
		};
	});
	self.wells = {};
	transectApp.TransectWellsCollection.each(function(well) {
		self.wells[well.get('id')] = {
			data: well,
			points: new PointsCollection(),
		}
	});
}

/* Generate list of wells with the appropriate polygon patterns. 
Polygon patters are obtained by getting the list of polygons that
overlap with the well. */

Exporter.prototype.processWells = function() {
}

/* Take the list of polygons and group them with respect to
their transect. In case a polygon is shared over multiple 
transects split the polygon at the reference wells that divide 
the polygon */

Exporter.prototype.processAllPolygons = function() {
	transectApp.PolygonsCollection.each(this.processPolygon.bind(this));
}

Exporter.prototype.processPolygon = function(polygon) {
	return this.generateTransectSpecificData(polygon, this.clipPolygon(polygon));
}

/* Clip polygon with respect to the will to generate more new polygons */

Exporter.prototype.clipPolygon = function(polygon) {
	var wells = this.getWellsListForTransects(polygon);
	var polygonsArray = [polygon.getPointsArray()];
	wells.each(function(well) {
		var currPolygon = polygonsArray.pop();
		var arrays = PolyK.Slice(currPolygon,well.get('x'), 0, well.get('x'), transectApp.Canvas.height);
		arrays.forEach(function(arr) {
			polygonsArray.push(arr);
		});
	});
	return polygonsArray;
}

Exporter.prototype.getPolygonsTransectsList = function(polygon) {
	var transects = new Transects();
	polygon.get('points').each(function(point) {
		transects.add(point.get('transect'));
	})
	return transects;
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
		
		var transect = transectsList[index];
		var wellLeft = transect.get('wellLeft');
		var wellRight = transect.get('wellRight');

		var pointsArray = []
		
		for (var i = 0; i < polygonArray.length; i+=2) {
			x = polygonArray[i];
			y = polygonArray[i + 1];
			var point = new Point({
				x: x,
				y: y
			});
			self.transects[transect.get('id')].points.add(point);

			if (point.get('relativeX') == 0) {
				self.wells[wellLeft.get('id')].points.add(point);
			} else if (point.get('relativeX') == 1) {
				self.wells[wellRight.get('id')].points.add(point);
			}
		}
	});
}