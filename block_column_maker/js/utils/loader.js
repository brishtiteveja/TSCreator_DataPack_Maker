/*=====================================================================
=            Loader that loads block data into block maker            =
=====================================================================*/


define(["zone", "marker", "blockColumn", "blockMarker"], function (Zone, Marker, BlockColumn, BlockMarker) {
    var Loader = function (app) {
        this.app = app;
        this.zones = this.app.ZonesCollection;
        this.markers = this.app.MarkersCollection;
        this.blockColumns = this.app.BlockColumnsCollection;
    }

    Loader.prototype.loadFromLocalStorage = function () {
        this.loadData(localStorage.blockApp);
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

    Loader.prototype.loadData = function (data) {
		this.savedData = JSON.parse(data);
		if (this.isDifferentJSONKey(data)) {
			this.savedData = this.changeJSONKey(this.savedData);
		}
        this.reset();
        this.load(data);
    }

    Loader.prototype.loadTextData = function (data) {
        this.reset();
        this.textData = data;
        this.parseTextData(data);
    }

    Loader.prototype.parseTextData = function (data) {
        var self = this;
        var lines = data.split('\n');
        var blockColumn = null;
        for (var i in lines) {
            var line = lines[i].split("\t");
            for (var j in line) {
                if ((line.length > 2) && (line[j].toLowerCase() === "block")) {
                    var x = blockColumn ? blockColumn.get('x') + blockColumn.get('width') : 0;
                    blockColumn = new BlockColumn({
                        name: line[0],
                        x: x,
                        width: parseInt(line[2])
                    });
                    self.blockColumns.add(blockColumn);
                } else {
                    if (blockColumn !== null && line.length > 2) {
                        self.parseBlockTextData(blockColumn, line);
                    }
                }
            }
        }
    }

    Loader.prototype.parseBlockTextData = function (column, blockData) {
        var prevBlock = column.get('blocks').last();
        var topY = prevBlock ? prevBlock.get("base").get('y') : 0;
        var baseY = topY + 10;
        var top = new BlockMarker({
            y: topY
        });
        var base = new BlockMarker({
            y: baseY
        });
        var block = new Block({
            name: blockData[1],
            top: top,
            base: base
        });
        column.get('blocks').add(block);
    }

    Loader.prototype.reset = function () {
        _.invoke(this.markers.toArray(), 'destroy');
        _.invoke(this.zones.toArray(), 'destroy');
        _.invoke(this.blockColumns.toArray(), 'destroy');
    }

    Loader.prototype.load = function (data) {
        this.loadImage();
        this.loadMarkersAndZones();
		if (!this.isDifferentJSONKey(data)) {
            this.loadBlockColumns();
		}
    }

    Loader.prototype.loadImage = function () {
        this.app.ImageOb.set(this.savedData.image);
    };

    Loader.prototype.loadMarkersAndZones = function () {
        var self = this;
        self.savedData.zones.forEach(function (zone, index) {
            var topMarker = self.markers.findWhere({
                y: zone.topMarker.y
            }) || new Marker(zone.topMarker);
            var baseMarker = self.markers.findWhere({
                y: zone.baseMarker.y
            }) || new Marker(zone.baseMarker);
            self.markers.add(topMarker);
            self.markers.add(baseMarker);

        });

        self.savedData.zones.forEach(function (zone, index) {
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
            }
        });
    }

    Loader.prototype.loadBlockColumns = function () {
        var self = this;
        this.savedData.blockColumns.forEach(function (blockColumnData) {
            var column = new BlockColumn(blockColumnData);
            self.blockColumns.add(column);

            self.addBlockMarkers(blockColumnData, column);
            self.updateBlockNames(blockColumnData, column);
        });
    }

    Loader.prototype.addBlockMarkers = function (blockColumnData, column) {
        var self = this;
        blockColumnData.blockMarkers.forEach(function (blockMarkerData) {
            self.addBlockMarkerToColumn(blockMarkerData, column);
        });
    }

    Loader.prototype.addBlockMarkerToColumn = function (blockMarkerData, column) {
        var self = this;
        var blockMarker = column.get('blockMarkers').findWhere({
                y: blockMarkerData.y
            }) ||
            new BlockMarker({
                name: blockMarkerData.name,
                y: blockMarkerData.y,
                blockColumn: column
            }, this.app);
        column.get('blockMarkers').add(blockMarker);
    }

    Loader.prototype.updateBlockNames = function (blockColumnData, column) {
        var self = this;
        blockColumnData.blocks.forEach(function (blockData) {
            var top = column.get('blockMarkers').findWhere({
                y: blockData.top.y
            });
            var base = column.get('blockMarkers').findWhere({
                y: blockData.base.y
            });
            if (top !== null && base !== null) {
                var block = column.get('blocks').findWhere({
                    top: top,
                    base: base
                });
                block.set({
                    name: blockData.name
                });
            }
        });
    }

    return Loader;
});

/*-----  End of Loader that loads block data into block maker  ------*/
