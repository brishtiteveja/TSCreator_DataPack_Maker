/*=================================================================
=            Loader that loads tsc data into the maker            =
=================================================================*/
define(["transectMarker", "transectWell", "polygon", "point", "transectText"], function(TransectMarker, TransectWell, Polygon, Point, TransectText){
	var Loader = function(app) {
		this.app = app;
		this.polygons = this.app.PolygonsCollection;
		this.zones = this.app.ZonesCollection;
		this.transects = this.app.TransectsCollection;
		this.markers = this.app.TransectMarkersCollection;
		this.wells = this.app.TransectWellsCollection;
		this.texts = this.app.TransectTextsCollection;
		this.points = this.app.PointsCollection;
		this.lines = this.app.LinesCollection;
	}

	Loader.prototype.loadFromLocalStorage = function() {
		this.loadData(localStorage.transectApp);
	}

	Loader.prototype.loadData = function(data) {
		this.savedData = JSON.parse(data);
		this.reset();
		this.load();
	}


	Loader.prototype.reset = function() {
		_.invoke(this.polygons.toArray(), 'destroy');
		_.invoke(this.zones.toArray(), 'destroy');
		_.invoke(this.transects.toArray(), 'destroy');
		_.invoke(this.markers.toArray(), 'destroy');
		_.invoke(this.wells.toArray(), 'destroy');
		_.invoke(this.texts.toArray(), 'destroy');
		_.invoke(this.points.toArray(), 'destroy');
		_.invoke(this.lines.toArray(), 'destroy');
		// this.polygons.reset();
		// this.zones.reset();
		// this.transects.reset();
		// this.markers.reset();
		// this.wells.reset();
		// this.texts.reset();
		// this.points.reset();
		// this.lines.reset();
	}

	Loader.prototype.load = function() {
		this.loadImage();
		this.loadMarkersAndZones();
		this.loadWellsAndTransects();
		this.loadPolygons();
		this.loadTexts();
		this.updateLines();
	}

	Loader.prototype.loadImage = function() {
		this.app.TransectImage.set(this.savedData.image);
	}

	Loader.prototype.loadMarkersAndZones = function() {
		var self = this;
		self.savedData.zones.forEach(function(zone, index) {
			var topMarker = self.markers.findWhere({y: zone.topMarker.y}) || new TransectMarker(zone.topMarker);
			var baseMarker = self.markers.findWhere({y: zone.baseMarker.y}) || new TransectMarker(zone.baseMarker);
			self.markers.add(topMarker);
			self.markers.add(baseMarker);
			
		});
		
		self.savedData.zones.forEach(function(zone, index) {
			var topMarker = self.markers.findWhere({y: zone.topMarker.y});
			var baseMarker = self.markers.findWhere({y: zone.baseMarker.y});
			var newZone = self.zones.findWhere({'topMarker': topMarker, 'baseMarker': baseMarker});
			if (newZone !== undefined) {
				newZone.set({
					name: zone.name,
					description: zone.description,
				});	
			}
		});
	}

	Loader.prototype.loadWellsAndTransects = function() {
		var self = this;
		self.savedData.transects.forEach(function(transect, index) {
			var wellLeft = self.wells.findWhere({x: transect.wellLeft.x}) || new TransectWell(transect.wellLeft);
			var wellRight = self.wells.findWhere({x: transect.wellRight.x}) || new TransectWell(transect.wellRight);
			self.wells.add(wellLeft);
			self.wells.add(wellRight);
		});

		self.savedData.transects.forEach(function(transect, index) {
			var wellLeft = self.wells.findWhere({x: transect.wellLeft.x});
			var wellRight = self.wells.findWhere({x: transect.wellRight.x});
			({x: transect.wellRight.x});
			var newTransect = self.transects.findWhere({'wellLeft': wellLeft, 'wellRight': wellRight});
			if (newTransect !== undefined) {
				newTransect.set({
					name: transect.name,
					description: transect.description,
				});
			}
		});
	}

	Loader.prototype.loadPolygons = function() {
		var self = this;
		self.savedData.polygons.forEach(function(polygon) {
			self.createPolygon(polygon);
		});
	}

	Loader.prototype.createPolygon = function(polygonData) {
		var self = this;
		var polygon = self.polygons.findWhere({name: polygonData.name, patternName: polygonData.patternName}) || new Polygon({name: polygonData.name});
		this.polygons.add(polygon);
		polygonData.points.forEach(function(pointData) {
			var point = self.points.findWhere({x: pointData.x, y: pointData.y}) || new Point({x: pointData.x, y: pointData.y}, self.app);
			polygon.get('points').add(point);
		});
		polygon.set({patternName: polygonData.patternName}); // we do this after so that the pattern show up by default.
	}

	Loader.prototype.loadTexts = function() {
		var self = this;
		self.savedData.texts.forEach(function(text) {
			var transectText = self.texts.findWhere({text: text.text, x: text.x, y: text.y}) || new TransectText(text, self.app);
			self.texts.add(transectText);
			transectText.get('settings').set(text.settings);
		})
	}

	Loader.prototype.updateLines = function() {
		var self = this;
		self.savedData.lines.forEach(function(line) {
			var point1 = self.points.findWhere({x: line.point1.x, y: line.point1.y});
			var point2 = self.points.findWhere({x: line.point2.x, y: line.point2.y});
			var ln = self.lines.findWhere({point1: point1, point2: point2}) || self.lines.findWhere({point1: point2, point2: point1});
			if (ln) {
				ln.set({
					name: line.name,
					pattern: line.pattern
				});	
			}
		});
	}

	return Loader;
});
/*-----  End of Loader that loads tsc data into the maker  ------*/