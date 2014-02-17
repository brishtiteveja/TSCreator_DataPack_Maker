/*=====================================================================
=            Loader that loads lithology data into lithology maker            =
=====================================================================*/


define(["zone", "marker", "lithologyColumn", "lithologyMarker"], function(Zone, Marker, LithologyColumn, LithologyMarker) {
	var Loader = function(app) {
		this.app = app;
		this.zones = this.app.ZonesCollection;
		this.markers = this.app.MarkersCollection;
		this.lithologyColumns = this.app.LithologyColumnsCollection;
	}

	Loader.prototype.loadFromLocalStorage = function() {
		this.loadData(localStorage.lithologyApp);
	}

	Loader.prototype.loadData = function(data) {
		this.savedData = JSON.parse(data);
		this.reset();
		this.load();
	}

	Loader.prototype.loadTextData = function(data) {
		this.reset();
		this.textData = data;
		this.parseTextData(data);
	}

	Loader.prototype.parseTextData = function(data) {
		var self = this;
		var lines = data.split('\n');
		var lithologyColumn = null;
		for (var i in lines) {
			var line = lines[i].split("\t");
			for (var j in line) {
				if ((line.length > 2) && (line[j].toLowerCase() === "lithology")) {
					var x = lithologyColumn ? lithologyColumn.get('x') + lithologyColumn.get('width') : 0;
					lithologyColumn = new LithologyColumn({name: line[0], x: x, width: parseInt(line[2])});
					self.lithologyColumns.add(lithologyColumn);
				} else {
					if (lithologyColumn !== null && line.length > 2) {
						self.parseLithologyTextData(lithologyColumn, line);
					}
				}
			}
		}
	}

	Loader.prototype.parseLithologyTextData = function(column, lithologyData) {
		var prevLithology = column.get('lithologys').last();
		var topY = prevLithology ? prevLithology.get("base").get('y') : 0;
		var baseY = topY + 10;
		var top = new LithologyMarker({y: topY});
		var base = new LithologyMarker({y: baseY});
		var lithology = new Lithology({name: lithologyData[1], top: top, base: base});
		column.get('lithologys').add(lithology);
	}

	Loader.prototype.reset = function() {
		_.invoke(this.markers.toArray(), 'destroy');
		_.invoke(this.zones.toArray(), 'destroy');
		_.invoke(this.lithologyColumns.toArray(), 'destroy');
	}

	Loader.prototype.load = function() {
		this.loadMarkersAndZones();
		this.loadLithologyColumns();
	}


	Loader.prototype.loadMarkersAndZones = function() {
		var self = this;
		self.savedData.zones.forEach(function(zone, index) {
			var topMarker = self.markers.findWhere({y: zone.topMarker.y}) || new Marker(zone.topMarker);
			var baseMarker = self.markers.findWhere({y: zone.baseMarker.y}) || new Marker(zone.baseMarker);
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

	Loader.prototype.loadLithologyColumns = function() {
		var self = this;
		this.savedData.lithologyColumns.forEach(function(lithologyColumnData) {
			var column = new LithologyColumn(lithologyColumnData);
			self.lithologyColumns.add(column);
			
			self.addLithologyMarkers(lithologyColumnData, column);
			self.updateLithologyNames(lithologyColumnData, column);
		});
	}

	Loader.prototype.addLithologyMarkers = function(lithologyColumnData, column) {
		var self = this;
		lithologyColumnData.lithologyMarkers.forEach(function(lithologyMarkerData) {
			self.addLithologyMarkerToColumn(lithologyMarkerData, column);
		});		
	}

	Loader.prototype.addLithologyMarkerToColumn = function(lithologyMarkerData, column) {
		var self = this;
		var lithologyMarker = column.get('lithologyMarkers').findWhere({y: lithologyMarkerData.y}) ||
		 new LithologyMarker({name: lithologyMarkerData.name, y: lithologyMarkerData.y, lithologyColumn: column}, this.app);
		column.get('lithologyMarkers').add(lithologyMarker);
	}

	Loader.prototype.updateLithologyNames = function(lithologyColumnData, column) {
		var self = this;
		lithologyColumnData.lithologys.forEach(function(lithologyData) {
			var top = column.get('lithologyMarkers').findWhere({y: lithologyData.top.y});
			var base = column.get('lithologyMarkers').findWhere({y: lithologyData.base.y});
			if (top !== null && base !== null) {
				var lithology = column.get('lithologys').findWhere({top: top, base: base});	
				lithology.set({
					name: lithologyData.name
				});
			}
		});
	}

	return Loader;
});

/*-----  End of Loader that loads lithology data into lithology maker  ------*/

