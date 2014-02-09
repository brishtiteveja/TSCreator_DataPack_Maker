/*=====================================================================
=            Loader that loads referenceBlock data into referenceBlock maker            =
=====================================================================*/


define(["referenceBlockColumn", "referenceBlockMarker", "referenceBlock"], function(ReferenceBlockColumn, ReferenceBlockMarker, ReferenceBlock) {
	var Loader = function(app) {
		this.app = app;
		this.referenceBlockColumns = this.app.ReferenceBlockColumnsCollection;
	}

	Loader.prototype.loadFromLocalStorage = function() {
		this.loadData(localStorage.referenceColumnApp);
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
		var referenceBlockColumn = null;
		for (var i in lines) {
			var line = lines[i].split("\t");
			if ((line.length > 2) && (line[1].toLowerCase() === "block")) {
				var x = referenceBlockColumn ? referenceBlockColumn.get('x') + referenceBlockColumn.get('width') : 0;
				referenceBlockColumn = new ReferenceBlockColumn({name: line[0], x: x, width: parseInt(line[2])});
				self.referenceBlockColumns.add(referenceBlockColumn);
			} else {
				if (referenceBlockColumn !== null && line.length > 2) {
					self.parseBlockTextData(referenceBlockColumn, line);
				}
			}
		}
	}

	Loader.prototype.parseBlockTextData = function(column, referenceBlockData) {
		var prevBlock = column.get('blocks').last();
		var topY = prevBlock ? prevBlock.get("base").get('y') : 0;
		var baseY = topY + 100;
		
		var top = column.get("blockMarkers").findWhere({y: topY})
		
		if (top === undefined) {
			top = new ReferenceBlockMarker({name: prevBlock ? prevBlock.get('name') + " base": "TOP", y: topY, blockColumn: column});
			column.get('blockMarkers').add(top);
		}

		var base = column.get("blockMarkers").findWhere({y: baseY});

		if (base === undefined) {
			base = new ReferenceBlockMarker({name: referenceBlockData.name + " base", y: baseY, blockColumn: column});
			column.get('blockMarkers').add(base);	
		}
	}

	Loader.prototype.reset = function() {
		_.invoke(this.referenceBlockColumns.toArray(), 'destroy');
	}

	Loader.prototype.load = function() {
		this.ReferenceloadBlockColumns();
	}

	Loader.prototype.ReferenceloadBlockColumns = function() {
		var self = this;
		this.savedData.referenceBlockColumns.forEach(function(referenceBlockColumnData) {
			var column = new ReferenceBlockColumn(referenceBlockColumnData);
			self.referenceBlockColumns.add(column);
			
			self.addBlockMarkers(referenceBlockColumnData, column);
			self.updateBlockNames(referenceBlockColumnData, column);
		});
	}

	Loader.prototype.addBlockMarkers = function(referenceBlockColumnData, column) {
		var self = this;
		referenceBlockColumnData.blockMarkers.forEach(function(referenceBlockMarkerData) {
			self.addBlockMarkerToColumn(referenceBlockMarkerData, column);
		});		
	}

	Loader.prototype.addBlockMarkerToColumn = function(referenceBlockMarkerData, column) {
		var self = this;
		var referenceBlockMarker = column.get('blockMarkers').findWhere({y: referenceBlockMarkerData.y}) ||
		 new ReferenceBlockMarker({name: referenceBlockMarkerData.name, y: referenceBlockMarkerData.y, blockColumn: column}, this.app);
		column.get('blockMarkers').add(referenceBlockMarker);
	}

	Loader.prototype.updateBlockNames = function(referenceBlockColumnData, column) {
		var self = this;
		referenceBlockColumnData.blocks.forEach(function(referenceBlockData) {
			var top = column.get('blockMarkers').findWhere({y: referenceBlockData.top.y});
			var base = column.get('blockMarkers').findWhere({y: referenceBlockData.base.y});
			if (top !== null && base !== null) {
				var referenceBlock = column.get('blocks').findWhere({top: top, base: base});	
				referenceBlock.set({
					name: referenceBlockData.name
				});
			}
		});
	}

	return Loader;
});

/*-----  End of Loader that loads referenceBlock data into referenceBlock maker  ------*/

