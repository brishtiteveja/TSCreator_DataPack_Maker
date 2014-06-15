define([
	"zone",
	"marker",
	"lithologyColumn",
	"lithologyGroupMarker",
	"lithologyMarker"
], function(
	Zone,
	Marker,
	LithologyColumn,
	LithologyGroupMarker,
	LithologyMarker
) {
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
		this.parseMinAndMaxAgesAndAddMarkers(data);
		this.parseColumnData(data);
	}

	Loader.prototype.parseMinAndMaxAgesAndAddMarkers = function(data) {
		var self = this;
		this.minAge = Infinity;
		this.maxAge = 0;
		var lines = data.split(/\r|\n/);
		var lithologyColumn = null;
		var lithologyColumnTextData = [];
		for (var i in lines) {
			var line = lines[i].split("\t");
			if (line.length > 1) {
				if (line[1].toLowerCase() === "facies") {
					lithologyColumn = true;
				} else {
					if (lithologyColumn) {
						if (line.length > 2 && line[3].length > 0) {
							this.minAge = parseFloat(line[3]) < this.minAge ? parseFloat(line[3]) : this.minAge;
							this.maxAge = parseFloat(line[3]) > this.maxAge ? parseFloat(line[3]) : this.maxAge;
						}
					}
				}
			} else {
				lithologyColumn = false
			}
		}

		this.topAge = parseInt(this.minAge);
		var topMarker = new Marker({
			y: 50,
			age: this.topAge
		});

		this.markers.add(topMarker);

		this.baseAge = parseInt(this.maxAge) + 1;

		var baseMarker = new Marker({
			y: this.getYFromAge(this.baseAge),
			age: this.baseAge
		});

		this.markers.add(baseMarker);
	}

	Loader.prototype.getYFromAge = function(age) {
		return 50 + Math.round((age - this.topAge) * 30); // 30 pixes per million years
	}

	Loader.prototype.parseColumnData = function(data) {
		var self = this;
		var lines = data.split(/\r|\n/);
		var lithologyColumn = null;
		var lithologyColumnTextData = [];
		for (var i in lines) {
			var line = lines[i].split("\t");
			if (line.length > 1) {
				if (line[1].toLowerCase() === "facies") {
					lithologyColumn = this.createLithologyColumn(line);
				} else {
					if (lithologyColumn) {
						lithologyColumnTextData.push(line);
					}
				}
			} else {
				if (lithologyColumn && lithologyColumnTextData.length > 1) {
					self.parseColumnTextData(lithologyColumn, lithologyColumnTextData);
				}
				lithologyColumnTextData = [];
				lithologyColumn = null
			}
		}
	}


	Loader.prototype.createLithologyColumn = function(columnData) {
		var x = 0;
		if (this.lithologyColumns.length > 0) {
			x = this.lithologyColumns.last().get('x') + this.lithologyColumns.last().get('width');
		}
		var name = columnData[0];
		var lithologyColumn = new LithologyColumn({
			x: x,
			name: name,
			width: parseInt(columnData[2])
		});
		this.lithologyColumns.add(lithologyColumn);
		return lithologyColumn;
	}

	Loader.prototype.parseColumnTextData = function(column, data) {
		this.createGroups(column, data);
		this.createLithologys(column, data);
		// debugger;
	}

	Loader.prototype.createGroups = function(column, data) {
		for (var i = 0; i < data.length; i++) {
			if (data[i][0].length > 0) {
				this.createLithologyGroupMarker(column, data[i], data[i + 1][3]);
			}
		}
		for (var i = 0; i < data.length; i++) {
			if (data[i][0].length > 0) {
				this.updateGroupInfo(column, data[i], data[i + 1][3]);
			}
		}
	}

	Loader.prototype.createLithologyGroupMarker = function(column, data, age) {
		var lithologyGroupMarker = new LithologyGroupMarker({
				name: data[0] + " Top",
				y: this.getYFromAge(age),
				lithologyColumn: column
			},
			this.app);

		column.get('lithologyGroupMarkers').add(lithologyGroupMarker);
	}

	Loader.prototype.updateGroupInfo = function(column, data, age) {
		var group = this.findGroup(column, data, age);

		if (group) {
			group.set({
				name: data[0],
				type: data[1],
				description: data[4]
			});

			group.update();
		}
	}

	Loader.prototype.findGroup = function(column, data, age) {
		var topMarker = column.get('lithologyGroupMarkers').findWhere({
			y: this.getYFromAge(age)
		});

		if (topMarker) {
			var group = column.get('lithologyGroups').findWhere({
				top: topMarker
			});
			return group;
		}
		return null;
	}

	Loader.prototype.createLithologys = function(column, data) {
		var group = null;
		for (var i = 0; i < data.length; i++) {
			if (data[i][0].length > 0) {
				group = this.findGroup(column, data[i], data[i + 1][3]);
			} else {
				if (group) {
					this.createLithologyMarker(group, data[i]);
				}
			}
		}
	}

	Loader.prototype.createLithologyMarker = function(group, data) {
		var lithologyMarker = group.get('lithologyColumn').get('lithologyMarkers').findWhere({
			y: this.getYFromAge(data[3])
		}) || new LithologyMarker({
			y: this.getYFromAge(data[3]),
			name: data[2],
			lithologyGroup: group
		}, this.app);
		group.get('lithologyMarkers').add(lithologyMarker);
		group.get('lithologyColumn').get('lithologyMarkers').add(lithologyMarker);
	}


	Loader.prototype.parseLithologyTextData = function(column, lithologyData) {

		var prevLithology = column.get('lithologys').last();
		var topY = prevLithology ? prevLithology.get("base").get('y') : 0;
		var baseY = topY + 10;
		var top = new LithologyGroupMarker({
			y: topY
		});
		var base = new LithologyGroupMarker({
			y: baseY
		});
		var lithology = new Lithology({
			name: lithologyData[1],
			top: top,
			base: base
		});
		column.get('lithologys').add(lithology);
	}

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
			var topMarker = self.markers.findWhere({
				y: zone.topMarker.y
			}) || new Marker(zone.topMarker);
			var baseMarker = self.markers.findWhere({
				y: zone.baseMarker.y
			}) || new Marker(zone.baseMarker);
			self.markers.add(topMarker);
			self.markers.add(baseMarker);

		});

		self.savedData.zones.forEach(function(zone, index) {
			var topMarker = self.markers.findWhere({
				y: zone.topMarker.y
			});
			var baseMarker = self.markers.findWhere({
				y: zone.baseMarker.y
			});
			var newZone = self.zones.findWhere({
				'topMarker': topMarker,
				'baseMarker': baseMarker
			});
			if (newZone !== undefined) {
				newZone.set({
					name: zone.name,
					description: zone.description,
				});
				newZone.update()
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
		var lithologyGroupMarker = column.get('lithologyGroupMarkers').findWhere({
			y: lithologyGroupMarkerData.y
		}) ||
			new LithologyGroupMarker({
				name: lithologyGroupMarkerData.name,
				y: lithologyGroupMarkerData.y,
				lithologyColumn: column
			}, this.app);
		column.get('lithologyGroupMarkers').add(lithologyGroupMarker);
	}

	Loader.prototype.updateLithologyGroups = function(lithologyColumnData, column) {
		var self = this;
		lithologyColumnData.lithologyGroups.forEach(function(lithologyGroupData) {
			var top = column.get('lithologyGroupMarkers').findWhere({
				y: lithologyGroupData.top.y
			});
			var base = column.get('lithologyGroupMarkers').findWhere({
				y: lithologyGroupData.base.y
			});
			if (top !== null && base !== null) {
				var lithologyGroup = column.get('lithologyGroups').findWhere({
					top: top,
					base: base
				});
				lithologyGroup.set({
					edit: true,
					id: lithologyGroupData.id,
					name: lithologyGroupData.name,
					description: lithologyGroupData.description,
				});

				lithologyGroup.get("settings").set(lithologyGroupData.settings);

				// We are setting and resetting the edit so that the div element of the view is
				// re-rendered to show updated info.

				lithologyGroup.set({
					edit: false
				});

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

	Loader.prototype.addLithologyMarkerToGroup = function(lithologyMarkerData, lithologyGroup) {
		var self = this;
		var column = lithologyGroup.get('lithologyColumn');
		var lithologyMarker = column.get('lithologyMarkers').findWhere({
			y: lithologyMarkerData.y
		}) ||
			new LithologyMarker({
				name: lithologyMarkerData.name,
				y: lithologyMarkerData.y,
				lithologyGroup: lithologyGroup
			}, this.app);
		lithologyGroup.get('lithologyMarkers').add(lithologyMarker);
	}

	Loader.prototype.updateLithologys = function(lithologyGroupData, lithologyGroup) {
		var self = this;
		var column = lithologyGroup.get('lithologyColumn');
		lithologyGroupData.lithologys.forEach(function(lithologyData) {
			var top = lithologyGroup.get('lithologyMarkers').findWhere({
				y: lithologyData.top.y
			}) || column.get('lithologyMarkers').findWhere({
				y: lithologyData.top.y
			});
			var base = lithologyGroup.get('lithologyMarkers').findWhere({
				y: lithologyData.base.y
			}) || column.get('lithologyMarkers').findWhere({
				y: lithologyData.base.y
			});
			if (top !== null && base !== null) {
				var lithology = lithologyGroup.get('lithologys').findWhere({
					top: top,
					base: base
				});
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

				lithology.set({
					edit: false
				});
			}
		});
	}

	// This function checks the given groupId with the ids in the saved list and return true
	// if the id exists or not.

	Loader.prototype.groupExists = function(groupId, lithologyColumnData) {
		var exists = false;

		for (var i = 0; i < lithologyColumnData.lithologyGroups.length; i++) {
			if (lithologyColumnData.lithologyGroups[i].id === groupId) {
				exists = true;
				break;
			}

		}
		return exists;
	}

	Loader.prototype.lithologyExists = function(lithologyId, lithologyGroupData) {
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