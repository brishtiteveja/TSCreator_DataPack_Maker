define([
    "zone",
    "marker",
    "lithologyColumn",
    "lithologyGroupMarker",
    "lithologyMarker",
    "point"
], function (
    Zone,
    Marker,
    LithologyColumn,
    LithologyGroupMarker,
    LithologyMarker,
    Point
) {
    var Loader = function (app) {
        this.app = app;
        this.zones = this.app.ZonesCollection;
        this.markers = this.app.MarkersCollection;
        this.lithologyColumns = this.app.LithologyColumnsCollection;
        this.polygons = this.app.lithology2dApp.PolygonsCollection;
    };

    Loader.prototype.loadFromLocalStorage = function () {
        this.loadData(localStorage.lithologyApp);
    };

	Loader.prototype.changeJSONKey = function(data) {
		var newKeyDict = {
			// background image related JSON keys
			'backgroundImage'		: 'image',
			'curWidth'				: 'width',
			'curHeight'				: 'height',
			'isPreserveAspectRatio' : 'preserveAspectRatio',
			'isVisible'				: 'visible',
			'dataURL'				: 'data',
			// timelines, zones related keys
			'timelines'				: 'markers',
			'top'					: 'topMarker',
			'base'					: 'baseMarker',
		};	

		oldKeys = Object.keys(newKeyDict); 
		newData = {};
		
		for (key in data) {
			value = data[key];
			contains = false;
			for (i=0; i<oldKeys.length; i++) {
				k = oldKeys[i];
				if (k == key) {
					contains = true;

				}
			}
			if (contains) {
				key = newKeyDict[key];
			}

			newValue = value;

			// handle subkeys for objects such as image
			if (key == "zones") {
    			for(i=0; i<value.length; i++) {
    				obj = value[i];
    				newObj = {};
    				for (kk in obj){
    					nkey = kk; // new subkey
    					contain = false;
    					for (ii=0; ii<oldKeys.length; ii++) {
    						kkk = oldKeys[ii];
    						if (kkk == kk) {
    							contain = true;
    						}
    					}
    					if (contain) {
    						nkey = newKeyDict[kk];
    					} 
    					newObj[nkey] = obj[kk];
    				}
    				if (Object.keys(newObj).length != 0) {
    					value[i] = newObj;
    				}
    			}
			}
			else if (key == "image") {
				nVal = {}; 
				for (kk in value){
					nkey = kk; // new subkey
					contain = false;
					for (ii=0; ii<oldKeys.length; ii++) {
						kkk = oldKeys[ii];
						if (kkk == kk) {
							contain = true;
						}
					}
					if (contain) {
						nkey = newKeyDict[kk];
					} 
					nVal[nkey] = value[kk];
				}
				newValue = nVal;
			}
		    newData[key] = newValue;	
		}

		return newData;
	}

	Loader.prototype.isDifferentJSONKey = function(data) {
		oldKeys = ['backgroundImage', 'curWidth', 'curHeight', 'isPreserveAspectRatio', 'isVisible',
				   'dataURL',		  'timelines','top',	   'base'
		          ];
		
		keys = Object.keys(JSON.parse(data));
		for (j=0; j<keys.length; j++) {
			key = keys[j];
			for (i=0; i<oldKeys.length; i++) {
				k = oldKeys[i];
				if (k == key) {
					return true;
				}
			}
		}

		return false;
	}

    Loader.prototype.loadData = function (data) {
		this.savedData = JSON.parse(data);
		if (this.isDifferentJSONKey(data)) {
			this.savedData = this.changeJSONKey(this.savedData);
		}
        this.reset();

		this.app.projectName = this.savedData.projectName;

        this.load();
    };

    Loader.prototype.loadTextData = function (data) {
        this.reset();
        this.textData = data;
		this.lithologyColumns.set('projectName', this.app.projectName);
        this.parseMinAndMaxAgesAndAddMarkers(data);
        this.parseColumnData(data);
    };

    Loader.prototype.parseMinAndMaxAgesAndAddMarkers = function (data) {
        this.minAge = Infinity;
        this.maxAge = 0;
        var lines = data.split(/\r|\n/);
        var lithologyColumn = null;
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
                lithologyColumn = false;
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
    };

    Loader.prototype.getYFromAge = function (age) {
        return 50 + Math.round((age - this.topAge) * 30); // 30 pixes per million years
    };

    Loader.prototype.parseColumnData = function (data) {
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
                lithologyColumn = null;
            }
        }
    };


    Loader.prototype.createLithologyColumn = function (columnData) {
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
    };

    Loader.prototype.parseColumnTextData = function (column, data) {
        this.createGroups(column, data);
        this.createLithologys(column, data);
    };

    Loader.prototype.createGroups = function (column, data) {
        for (var i = 0; i < data.length; i++) {
            if (data[i][0].length > 0) {
                this.createLithologyGroupMarker(column, data[i], data[(i > 0 ? i - 1 : i + 1)][3]);
            }
        }
        for (i = 0; i < data.length; i++) {
            if (data[i][0].length > 0) {
                this.updateGroupInfo(column, data[i], data[(i > 0 ? i - 1 : i + 1)][3]);
            }
        }
        this.createLithologyGroupMarker(column, data[data.length - 1], data[data.length - 1][3]);
    };

    Loader.prototype.createLithologyGroupMarker = function (column, data, age) {
        var lithologyGroupMarker = new LithologyGroupMarker({
                name: data[0] + " Top",
                y: this.getYFromAge(age),
                lithologyColumn: column
            },
            this.app);

        column.get('lithologyGroupMarkers').add(lithologyGroupMarker);
    };

    Loader.prototype.updateGroupInfo = function (column, data, age) {
        var group = this.findGroup(column, age);

        if (group) {
            group.set({
                name: data[0],
                type: data[1],
                description: data[4]
            });

            group.update();
        }
    };

    Loader.prototype.findGroup = function (column, age) {
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
    };

    Loader.prototype.createLithologys = function (column, data) {
        var group = null;
        for (var i = 0; i < data.length; i++) {
            if (data[i][0].length > 0) {
                group = this.findGroup(column, data[(i > 0 ? i - 1 : i + 1)][3]);
            } else {
                if (group) {
                    this.createLithologyMarker(group, data[i]);
                }
            }
        }
        group = null;
        for (i = 0; i < data.length; i++) {
            if (data[i][0].length > 0) {
                group = this.findGroup(column, data[(i > 0 ? i - 1 : i + 1)][3]);
            } else {
                if (group) {
                    this.updateLithologyInfo(group, data[i]);
                }
            }
        }
    };

    Loader.prototype.findLithology = function (group, age) {
        var baseMarker = group.get('lithologyMarkers').findWhere({
            y: this.getYFromAge(age)
        });

        if (baseMarker) {
            var lithology = group.get('lithologys').findWhere({
                base: baseMarker
            });
            return lithology;
        }
        return null;
    };

    Loader.prototype.updateLithologyInfo = function (group, data) {
        var lithology = this.findLithology(group, data[3]);
        if (lithology) {
            lithology.set({
                name: data[2],
                description: data[4],
                pattern: this.getPatternKey(data[1])
            });
            lithology.update();
        }
    };

    Loader.prototype.getPatternKey = function (name) {
        var key = name.toLowerCase().split(/_| |-/).join('');
        if (key in this.app.patternsData) {
            return key;
        } else {
            return null;
        }
    };

    Loader.prototype.createLithologyMarker = function (group, data) {
        var lithologyMarker = group.get('lithologyColumn').get('lithologyMarkers').findWhere({
            y: this.getYFromAge(data[3])
        }) || new LithologyMarker({
            y: this.getYFromAge(data[3]),
            name: data[2] + " base",
            lithologyGroup: group
        }, this.app);
        group.get('lithologyMarkers').add(lithologyMarker);
        group.get('lithologyColumn').get('lithologyMarkers').add(lithologyMarker);
    };

    Loader.prototype.reset = function () {
        _.invoke(this.markers.toArray(), 'destroy');
        _.invoke(this.zones.toArray(), 'destroy');
        _.invoke(this.lithologyColumns.toArray(), 'destroy');
        _.invoke(this.polygons.toArray(), 'destroy');
    };

    Loader.prototype.load = function () {
        this.loadImage();
        this.loadMarkersAndZones();
        this.loadLithologyColumns();
    };

    Loader.prototype.loadPolygons = function () {

    };

    Loader.prototype.loadImage = function () {
        this.app.ImageOb.set(this.savedData.image);
    };

    Loader.prototype.loadMarkersAndZones = function () {
        var self = this;
        self.savedData.zones.forEach(function (zone) {
            var topMarker = self.markers.findWhere({
                y: zone.topMarker.y
            }) || new Marker(zone.topMarker);
            var baseMarker = self.markers.findWhere({
                y: zone.baseMarker.y
            }) || new Marker(zone.baseMarker);
            self.markers.add(topMarker);
            self.markers.add(baseMarker);

        });

        self.savedData.zones.forEach(function (zone) {
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
                newZone.update();
            }
        });
    };

    Loader.prototype.loadLithologyColumns = function () {
        var self = this;
        this.savedData.lithologyColumns.forEach(function (lithologyColumnData) {
            var column = new LithologyColumn(lithologyColumnData);
            self.lithologyColumns.add(column);

            self.addLithologyGroupMarkers(lithologyColumnData, column);
            self.updateLithologyGroups(lithologyColumnData, column);

            if (lithologyColumnData.polygon) {
                self.createPolygon(column, lithologyColumnData.polygon);
            }
        });
    };

    Loader.prototype.createPolygon = function (column, polygonData) {
        var self = this;
        this.app.lithology2dView.polygonsView.createOverlay(column);
        polygonData.points.forEach(function (point) {
            if (column.get('polygon')) {
                self.app.lithology2dApp.map.center({
                    lat: point.lat,
                    lon: point.lon
                });
                var pt = new Point({});
                column.get('polygon').get('points').add(pt);
                pt.set({
                    lat: point.lat,
                    lon: point.lon
                });
            }
        });
    };

    Loader.prototype.addLithologyGroupMarkers = function (lithologyColumnData, column) {
        var self = this;
        lithologyColumnData.lithologyGroupMarkers.forEach(function (lithologyGroupMarkerData) {
            self.addLithologyGroupMarkerToColumn(lithologyGroupMarkerData, column);
        });
    };

    Loader.prototype.addLithologyGroupMarkerToColumn = function (lithologyGroupMarkerData, column) {
        var lithologyGroupMarker = column.get('lithologyGroupMarkers').findWhere({
                y: lithologyGroupMarkerData.y
            }) ||
            new LithologyGroupMarker({
                id: lithologyGroupMarkerData.id,
                name: lithologyGroupMarkerData.name,
                y: lithologyGroupMarkerData.y,
                lithologyColumn: column
            }, this.app);
        column.get('lithologyGroupMarkers').add(lithologyGroupMarker);
    };

    Loader.prototype.updateLithologyGroups = function (lithologyColumnData, column) {
        var self = this;
        lithologyColumnData.lithologyGroups.forEach(function (lithologyGroupData) {
            var top = column.get('lithologyGroupMarkers').findWhere({
                id: lithologyGroupData.top.id
            });
            var base = column.get('lithologyGroupMarkers').findWhere({
                id: lithologyGroupData.base.id
            });
            if (top !== null && base !== null) {
                var lithologyGroup = column.get('lithologyGroups').findWhere({
                    top: top,
                    base: base
                });
                if (lithologyGroup) {
                    lithologyGroup.set({
                        edit: true,
                        id: lithologyGroupData.id,
                        name: lithologyGroupData.name,
                        description: lithologyGroupData.description,
                    });

                    lithologyGroup.get("settings").set(lithologyGroupData.settings);

                    // We are setting and resetting the edit so that the div element of the view is
                    // re-rendered to show updated info.

                    lithologyGroup.update();

                    // Add Markers and Lithologys
                    self.updateLithologyGroupWithLithologys(lithologyGroupData, lithologyGroup);
                    self.updateLithologys(lithologyGroupData, lithologyGroup);
                }
            }
        });
    };

    Loader.prototype.updateLithologyGroupWithLithologys = function (lithologyGroupData, lithologyGroup) {
        var self = this;
        lithologyGroup.get('lithologyMarkers').first().set({
            id: lithologyGroupData.lithologyMarkers[0].id
        });
        lithologyGroup.get('lithologyMarkers').last().set({
            id: lithologyGroupData.lithologyMarkers[lithologyGroupData.lithologyMarkers.length - 1].id
        });
        for (var i = 1; i < lithologyGroupData.lithologyMarkers.length - 1; i++) {
            var lithologyMarkerData = lithologyGroupData.lithologyMarkers[i];
            self.addLithologyMarkerToGroup(lithologyMarkerData, lithologyGroup);
        }
    };

    Loader.prototype.addLithologyMarkerToGroup = function (lithologyMarkerData, lithologyGroup) {
        var column = lithologyGroup.get('lithologyColumn');
        var lithologyMarker = column.get('lithologyMarkers').findWhere({
            id: lithologyMarkerData.id
        }) || column.get('lithologyMarkers').findWhere({
            y: lithologyMarkerData.y
        }) || new LithologyMarker({
            y: lithologyMarkerData.y,
            lithologyGroup: lithologyGroup
        }, this.app);

        lithologyMarker.set({
            id: lithologyMarkerData.id,
            name: lithologyMarkerData.name,
        });
        lithologyGroup.get('lithologyMarkers').add(lithologyMarker);
    };

    Loader.prototype.updateLithologys = function (lithologyGroupData, lithologyGroup) {
        var column = lithologyGroup.get('lithologyColumn');
        lithologyGroupData.lithologys.forEach(function (lithologyData) {
            var top = lithologyGroup.get('lithologyMarkers').findWhere({
                id: lithologyData.top.id
            });
            var base = lithologyGroup.get('lithologyMarkers').findWhere({
                id: lithologyData.base.id
            });
            if (top !== null && base !== null) {
                var lithology = lithologyGroup.get('lithologys').findWhere({
                    top: top,
                    base: base
                });
                if (lithology) {

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

                    lithology.update();
                }
            }
        });
    };

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
    };

    Loader.prototype.lithologyExists = function (lithologyId, lithologyGroupData) {
        var exists = false;

        for (var i = 0; i < lithologyGroupData.lithologys.length; i++) {
            if (lithologyGroupData.lithologys[i].id === lithologyId) {
                exists = true;
                break;
            }

        }
        return exists;
    };

    return Loader;
});
