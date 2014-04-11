/*=====================================================================
=            Loader that loads lithology data into lithology maker            =
=====================================================================*/


define(["zone", "marker", "lithologyColumn", "lithologyGroupMarker", "lithologyMarker"], function(Zone, Marker, LithologyColumn, LithologyGroupMarker, LithologyMarker) {
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

	// Loader.prototype.loadTextData = function(data) {
	// 	this.reset();
	// 	this.textData = data;
	// 	this.parseTextData(data);
	// }

	// Loader.prototype.parseTextData = function(data) {
	// 	var self = this;
	// 	var lines = data.split('\n');
	// 	var lithologyColumn = null;
	// 	for (var i in lines) {
	// 		var line = lines[i].split("\t");
	// 		for (var j in line) {
	// 			if ((line.length > 2) && (line[j].toLowerCase() === "lithology")) {
	// 				var x = lithologyColumn ? lithologyColumn.get('x') + lithologyColumn.get('width') : 0;
	// 				lithologyColumn = new LithologyColumn({name: line[0], x: x, width: parseInt(line[2])});
	// 				self.lithologyColumns.add(lithologyColumn);
	// 			} else {
	// 				if (lithologyColumn !== null && line.length > 2) {
	// 					self.parseLithologyTextData(lithologyColumn, line);
	// 				}
	// 			}
	// 		}
	// 	}
	// }

	// Loader.prototype.parseLithologyTextData = function(column, lithologyData) {
	// 	var prevLithology = column.get('lithologys').last();
	// 	var topY = prevLithology ? prevLithology.get("base").get('y') : 0;
	// 	var baseY = topY + 10;
	// 	var top = new LithologyGroupMarker({y: topY});
	// 	var base = new LithologyGroupMarker({y: baseY});
	// 	var lithology = new Lithology({name: lithologyData[1], top: top, base: base});
	// 	column.get('lithologys').add(lithology);
	// }

	Loader.prototype.reset = function() {
		_.invoke(this.markers.toArray(), 'destroy');
		_.invoke(this.zones.toArray(), 'destroy');
		_.invoke(this.lithologyColumns.toArray(), 'destroy');
	}

	Loader.prototype.load = function() {
		this.loadImage();
		this.loadMarkersAndZones();
		this.loadLithologyColumns();
	}

	Loader.prototype.loadImage = function() {
		this.app.ImageOb.set(this.savedData.image);
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
			
			self.addLithologyGroupMarkers(lithologyColumnData, column);
			self.updateLithologyGroups(lithologyColumnData, column);
			self.deleteUnnecessaryLithologyGroups(lithologyColumnData, column);
		});
	}

	Loader.prototype.addLithologyGroupMarkers = function(lithologyColumnData, column) {
		var self = this;
		lithologyColumnData.lithologyGroupMarkers.forEach(function(lithologyGroupMarkerData) {
			self.addLithologyGroupMarkerToColumn(lithologyGroupMarkerData, column);
		});		
	}

	Loader.prototype.addLithologyGroupMarkerToColumn = function(lithologyGroupMarkerData, column) {
		var self = this;
		var lithologyGroupMarker = column.get('lithologyGroupMarkers').findWhere({y: lithologyGroupMarkerData.y}) ||
		 new LithologyGroupMarker({name: lithologyGroupMarkerData.name, y: lithologyGroupMarkerData.y, lithologyColumn: column}, this.app);
		column.get('lithologyGroupMarkers').add(lithologyGroupMarker);
	}

	Loader.prototype.updateLithologyGroups = function(lithologyColumnData, column) {
		var self = this;
		lithologyColumnData.lithologyGroups.forEach(function(lithologyGroupData) {
			var top = column.get('lithologyGroupMarkers').findWhere({y: lithologyGroupData.top.y});
			var base = column.get('lithologyGroupMarkers').findWhere({y: lithologyGroupData.base.y});
			if (top !== null && base !== null) {
				var lithologyGroup = column.get('lithologyGroups').findWhere({top: top, base: base});	
				lithologyGroup.set({
					edit: true,
					id: lithologyGroupData.id,
					name: lithologyGroupData.name,
					description: lithologyGroupData.description,
				});

				lithologyGroup.get("settings").set(lithologyGroupData.settings);

				// We are setting and resetting the edit so that the div element of the view is
				// re-rendered to show updated info.

				lithologyGroup.set({edit: false});

				// Add Markers and Lithologys
				self.updateLithologyGroupWithLithologys(lithologyGroupData, lithologyGroup);
				self.updateLithologys(lithologyGroupData, lithologyGroup);
				self.deleteUnnecessaryLithologys(lithologyGroupData, lithologyGroup);
			}
		});
	}

	Loader.prototype.updateLithologyGroupWithLithologys = function(lithologyGroupData, lithologyGroup) {
		var self = this;
		lithologyGroupData.lithologyMarkers.forEach(function(lithologyMarkerData) {
			self.addLithologyMarkerToGroup(lithologyMarkerData, lithologyGroup);
		});
	}

	Loader.prototype.addLithologyMarkerToGroup = function(lithologyMarkerData,lithologyGroup) {
		var self = this;
		var column = lithologyGroup.get('lithologyColumn');
		var lithologyMarker = column.get('lithologyMarkers').findWhere({y: lithologyMarkerData.y}) ||
		 new LithologyMarker({name: lithologyMarkerData.name, y: lithologyMarkerData.y, lithologyGroup: lithologyGroup}, this.app);
		lithologyGroup.get('lithologyMarkers').add(lithologyMarker);
	}

	Loader.prototype.updateLithologys = function(lithologyGroupData, lithologyGroup) {
		var self = this;
		var column = lithologyGroup.get('lithologyColumn');
		lithologyGroupData.lithologys.forEach(function(lithologyData) {
			var top = lithologyGroup.get('lithologyMarkers').findWhere({y: lithologyData.top.y}) || column.get('lithologyMarkers').findWhere({y: lithologyData.top.y});
			var base = lithologyGroup.get('lithologyMarkers').findWhere({y: lithologyData.base.y}) || column.get('lithologyMarkers').findWhere({y: lithologyData.base.y});
			if (top !== null && base !== null) {
				var lithology = lithologyGroup.get('lithologys').findWhere({top: top, base: base});	
				lithology.set({
					edit: true,
					id: lithologyData.id,
					name: lithologyData.name,
					pattern: lithologyData.pattern,
					description: lithologyData.description,
				});

				lithologyGroup.get("settings").set(lithologyGroupData.settings);

				// We are setting and resetting the edit so that the div element of the view is
				// re-rendered to show updated info.

				lithology.set({edit: false});
			}
		});
	}

	// This function checks the given groupId with the ids in the saved list and return true
	// if the id exists or not.
	
	Loader.prototype.groupExists = function (groupId, lithologyColumnData) {
		var exists = false;

		for (var i = 0; i < lithologyColumnData.lithologyGroups.length; i++) {
			if (lithologyColumnData.lithologyGroups[i].id === groupId) {
				exists = true;
				break;
			}

		}
		return exists;
	}
	
	Loader.prototype.lithologyExists = function (lithologyId, lithologyGroupData) {
		var exists = false;

		for (var i = 0; i < lithologyGroupData.lithologys.length; i++) {
			if (lithologyGroupData.lithologys[i].id === lithologyId) {
				exists = true;
				break;
			}

		}
		return exists;
	}

	Loader.prototype.deleteUnnecessaryLithologyGroups = function(lithologyColumnData, column) {
		var self = this;
		column.get('lithologyGroups').each(function(lithologyGroup) {
			if (!self.groupExists(lithologyGroup.id, lithologyColumnData)) {
				lithologyGroup.destroy();
			}
		});
	}
	
	Loader.prototype.deleteUnnecessaryLithologys = function(lithologyGroupData, lithologyGroup) {
		var self = this;
		lithologyGroup.get('lithologys').each(function(lithology) {
			if (!self.lithologyExists(lithology.id, lithologyGroupData)) {
				lithology.destroy();
			}
		});
	}

	return Loader;
});

/*-----  End of Loader that loads lithology data into lithology maker  ------*/

