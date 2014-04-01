/*=====================================================================
=            Loader that loads referenceBlock data into referenceBlock maker            =
=====================================================================*/


define(["referenceBlockColumn", "referenceBlockMarker", "referenceBlock"], function(ReferenceBlockColumn, ReferenceBlockMarker, ReferenceBlock) {
	var Loader = function(app) {
		this.app = app;	
		this.referenceBlockColumns = this.app.ReferenceBlockColumnsCollection;
	}

	Loader.prototype.loadFromLocalStorage = function() {
		this.loadJSONData(localStorage.referenceColumnApp);
	}

	Loader.prototype.loadData = function(data) {
		this.savedData = JSON.parse(data);
		this.reset();
		this.load();
	}

	Loader.prototype.loadJSONData = function(data) {
		this.loadData(JSON.parse(data));
	}

	Loader.prototype.loadTextData = function(data) {
		this.reset();
		this.textData = data;
		this.parseTextData(data);
		this.updateYCdtsWrtAge();
	}

	Loader.prototype.parseTextData = function(data) {
		var self = this;
		var lines = data.split(/\r\n|\r|\n/g);
		var referenceBlockColumn = null;
		for (var i in lines) {
			var line = lines[i].split("\t");
			if ((line.length > 2) && (line[1].toLowerCase() === "block")) {
				var x = referenceBlockColumn ? referenceBlockColumn.get('x') + referenceBlockColumn.get('width') : 0;
				referenceBlockColumn = new ReferenceBlockColumn({name: line[0], x: x});
				self.referenceBlockColumns.add(referenceBlockColumn);
			} else {
				if (referenceBlockColumn && line.length > 1 ) {
					var age = parseFloat(line[2]);
					if (line[1].toLowerCase() === "top") {
						if (!age) {
							age = 0;
							line[2] = 0;
						}
					}
					if (age >= 0) {
						self.parseBlockTextData(referenceBlockColumn, line);	
					}
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
			top = new ReferenceBlockMarker({name: "top", y: topY, blockColumn: column, age: referenceBlockData[2]});
			column.get('blockMarkers').add(top);
		} else {
			var base = column.get("blockMarkers").findWhere({y: baseY});

			if (base === undefined) {
				base = new ReferenceBlockMarker({y: baseY, blockColumn: column, age: referenceBlockData[2]});
				column.get('blockMarkers').add(base);	
			}

			base.set({
				name: referenceBlockData[1]  + " base"
			});

			var block = column.get('blocks').findWhere({top: top, base: base});
			block.set({
				name: referenceBlockData[1] || " ",
				description: referenceBlockData[4] || null,
			});	

			block.get('settings').set({
				backgroundColor: TscToCssColor(referenceBlockData[5])
			});
		}
	}

	Loader.prototype.updateYCdtsWrtAge = function() {
		var self = this;
		var topAge = this.getMinAge();
		self.referenceBlockColumns.each(function(column) {
			self.updateColumnYCdtsWrtAge(column, topAge);
		});
	}

	Loader.prototype.updateColumnYCdtsWrtAge = function(column, topAge) {
		var self = this;
		column.get('blockMarkers').each(function(blockMarker) {
			self.updateBlockMarkerYCdtsWrtAge(blockMarker, topAge);
		});
	}

	Loader.prototype.updateBlockMarkerYCdtsWrtAge = function(blockMarker, topAge) {
		var y = Math.round((blockMarker.get('age') - topAge)*5);
		blockMarker.set({
			y: y
		});
	}

	Loader.prototype.getMinAge = function() {
		var self = this;
		var minAge = 0;
		self.referenceBlockColumns.each(function(column) {
			var age = column.get('blockMarkers').first().get('age');
			minAge = Math.min(age, minAge);
		});
		return minAge;
	}

	Loader.prototype.reset = function() {
		_.invoke(this.referenceBlockColumns.toArray(), 'destroy');
	}

	Loader.prototype.load = function() {
		this.loadBlockColumns();
	}

	Loader.prototype.loadBlockColumns = function() {
		var self = this;
		this.savedData.referenceBlockColumns.forEach(function(referenceBlockColumnData) {
			self.loadBlockColumn(referenceBlockColumnData);
		});
	}

	Loader.prototype.loadBlockColumn = function(referenceBlockColumnData) {
		var self = this;
		var column = new ReferenceBlockColumn(referenceBlockColumnData);
		self.referenceBlockColumns.add(column);
		
		self.addBlockMarkers(referenceBlockColumnData, column);
		self.updateBlockNames(referenceBlockColumnData, column);
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
		 new ReferenceBlockMarker({y: referenceBlockMarkerData.y, blockColumn: column, age: referenceBlockMarkerData.age}, this.app);
		column.get('blockMarkers').add(referenceBlockMarker);
		referenceBlockMarker.set({
			name: referenceBlockMarkerData.name
		});
	}

	Loader.prototype.updateBlockNames = function(referenceBlockColumnData, column) {
		var self = this;
		referenceBlockColumnData.blocks.forEach(function(referenceBlockData) {
			var top = column.get('blockMarkers').findWhere({y: referenceBlockData.top.y});
			var base = column.get('blockMarkers').findWhere({y: referenceBlockData.base.y});
			if (top !== null && base !== null) {
				var referenceBlock = column.get('blocks').findWhere({top: top, base: base});
				if (referenceBlock) {
					referenceBlock.set({
						name: referenceBlockData.name,
						description: referenceBlockData.description
					});

					referenceBlock.get('settings').set({
						backgroundColor: referenceBlockData.settings.backgroundColor
					});
				}
			}
		});
	}

	return Loader;
});

/*-----  End of Loader that loads referenceBlock data into referenceBlock maker  ------*/

