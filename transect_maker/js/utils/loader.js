define(["marker", "transectWell", "polygon", "point", "transectText"], function(Marker, TransectWell, Polygon, Point, TransectText) {
	var Loader = function(app) {
		this.app = app;
		this.polygons = this.app.PolygonsCollection;
		this.zones = this.app.ZonesCollection;
		this.transects = this.app.TransectsCollection;
		this.markers = this.app.MarkersCollection;
		this.wells = this.app.TransectWellsCollection;
		this.texts = this.app.TransectTextsCollection;
		this.points = this.app.PointsCollection;
		this.lines = this.app.LinesCollection;
	}

	Loader.prototype.loadFromLocalStorage = function() {
		this.loadData(localStorage.transectApp);
	}

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

	Loader.prototype.loadData = function(data) {
		// Need to change the keys in json data imported from the universal datapack maker
		this.savedData = JSON.parse(data);
		if (this.isDifferentJSONKey(data)) {
			this.savedData = this.changeJSONKey(this.savedData);
		}
		this.reset();
		this.load();
	}


	Loader.prototype.reset = function() {
		_.invoke(this.texts.toArray(), 'destroy');
		_.invoke(this.lines.toArray(), 'destroy');
		_.invoke(this.points.toArray(), 'destroy');
		_.invoke(this.polygons.toArray(), 'destroy');
		_.invoke(this.zones.toArray(), 'destroy');
		_.invoke(this.transects.toArray(), 'destroy');
		_.invoke(this.markers.toArray(), 'destroy');
		_.invoke(this.wells.toArray(), 'destroy');

		// reset the reference column so that we can redraw the whole thing again.
		if (this.app.referenceColumn) {
			this.app.referenceColumn.set({
				columnId: "none"
			});
		}

	}

	Loader.prototype.load = function() {
		this.loadImage();
		this.loadMarkersAndZones();
		if(localStorage.BaseDatapack == null)
		{
		    this.loadReferenceColumnData();
		    this.loadWellsAndTransects();
		    this.loadPolygons();
		    this.loadTexts();
		    this.updateLines();
		}
	}

	Loader.prototype.loadImage = function() {
		this.app.ImageOb.set(this.savedData.image);
	}

	Loader.prototype.loadReferenceColumnData = function() {
		var self = this;
		if (self.savedData.referenceColumn && self.savedData.referenceColumn.columnId !== "none") {
			self.app.referenceColumn.set({
				columnId: self.savedData.referenceColumn.columnId,
				columnData: self.savedData.referenceColumn.columnData,
				top: self.savedData.referenceColumn.top,
				base: self.savedData.referenceColumn.base,
			});
			self.updateMarkerPositions();
		} else {
			self.loadMarkersAndZones();
		}
	}

	Loader.prototype.updateMarkerPositions = function() {
		var self = this;
		self.savedData.markers.forEach(function(markerData) {
			var marker = self.app.MarkersCollection.findWhere({
				age: markerData.age
			});
			if (marker) {
				marker.set({
					y: markerData.y
				});
			}
		});
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

				newZone.update();
			}
		});
	}

	Loader.prototype.loadWellsAndTransects = function() {
		var self = this;
		self.savedData.transects.forEach(function(transect, index) {
			var wellLeft = self.wells.findWhere({
				x: transect.wellLeft.x
			});

			var wellRight = self.wells.findWhere({
				x: transect.wellRight.x
			});

			if (wellLeft === undefined) {
				wellLeft = new TransectWell(transect.wellLeft);
				self.wells.add(wellLeft);
			}


			if (wellRight === undefined) {
				wellRight = new TransectWell(transect.wellRight);
				self.wells.add(wellRight);
			}
		});

		self.savedData.transects.forEach(function(transect, index) {
			var wellLeft = self.wells.findWhere({
				x: transect.wellLeft.x
			});
			var wellRight = self.wells.findWhere({
				x: transect.wellRight.x
			});
			var newTransect = self.transects.findWhere({
				'wellLeft': wellLeft,
				'wellRight': wellRight
			});
			if (newTransect !== undefined) {
				newTransect.set({
					name: transect.name,
					description: transect.description,
				});
				newTransect.update();
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
		var polygon = self.polygons.findWhere({
			id: polygonData.id,
			name: polygonData.name,
			patternName: polygonData.patternName
		}) || new Polygon({
			id: polygonData.id,
			name: polygonData.name,
			description: polygonData.description
		});
		this.polygons.add(polygon);
		polygonData.points.forEach(function(pointData) {
			var point = self.points.findWhere({
				x: parseInt(pointData.x),
				y: parseInt(pointData.y)
			}) || new Point({
				x: parseInt(pointData.x),
				y: parseInt(pointData.y)
			}, self.app);
			polygon.get('points').add(point);
		});
		polygon.set({
			patternName: polygonData.patternName
		}); // we do this after so that the pattern show up by default.
	}

	Loader.prototype.loadTexts = function() {
		var self = this;
		self.savedData.texts.forEach(function(text) {
			var transectText = self.texts.findWhere({
				text: text.text,
				x: text.x,
				y: text.y
			}) || new TransectText(text, self.app);
			self.texts.add(transectText);
			transectText.get('settings').set(text.settings);
		})
	}

	Loader.prototype.updateLines = function() {
		var self = this;
		self.savedData.lines.forEach(function(line) {
			var point1 = self.points.findWhere({
				x: parseInt(line.point1.x),
				y: parseInt(line.point1.y)
			});
			var point2 = self.points.findWhere({
				x: parseInt(line.point2.x),
				y: parseInt(line.point2.y)
			});
			var ln = self.lines.findWhere({
				point1: point1,
				point2: point2
			}) || self.lines.findWhere({
				point1: point2,
				point2: point1
			});
			if (ln) {
				ln.set({
					name: line.name,
					pattern: ln.get('pattern') === "default" ? line.pattern : ln.get('pattern')
				});
			}
		});
	}

	return Loader;
});
