/*=================================================================
=            Loader that loads tsc data into the maker            =
=================================================================*/
define(["transectMarker", "transectWell", "polygon", "point"], function(TransectMarker, TransectWell, Polygon, Point){
	var Loader = function() {
		this.polygons = transectApp.PolygonsCollection;
		this.zones = transectApp.ZonesCollection;
		this.transects = transectApp.TransectsCollection;
		this.markers = transectApp.TransectMarkersCollection;
		this.wells = transectApp.TransectWellsCollection;
	}

	Loader.prototype.loadFromLocalStorage = function() {
		this.savedData = JSON.parse(localStorage.transectApp);
		this.load();
	}

	Loader.prototype.load = function() {
		this.loadImage();
		this.loadMarkersAndZones();
		this.loadWellsAndTransects();
		this.loadPolygons();
	}

	Loader.prototype.loadImage = function() {
		transectApp.TransectImage.set(this.savedData.image);
	}

	Loader.prototype.loadMarkersAndZones = function() {
		var self = this;
		self.savedData.zones.forEach(function(zone, index) {
			var topMarker = self.markers.findWhere(zone.topMarker) || new TransectMarker(zone.topMarker);
			var baseMarker = self.markers.findWhere(zone.baseMarker) || new TransectMarker(zone.baseMarker)
			self.markers.add(topMarker);
			self.markers.add(baseMarker);
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
			var wellLeft = self.wells.findWhere(transect.wellLeft) || new TransectWell(transect.wellLeft);
			var wellRight = self.wells.findWhere(transect.wellRight) || new TransectWell(transect.wellRight)
			self.wells.add(wellLeft);
			self.wells.add(wellRight);
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
			var point = polygon.get('points').findWhere(pointData) || new Point(pointData);
			polygon.get('points').add(point);
		});
		polygon.set({patternName: polygonData.patternName}); // we do this after so that the pattern show up by default.
	}

	return Loader;
});
/*-----  End of Loader that loads tsc data into the maker  ------*/