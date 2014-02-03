/*=====================================================================
=            Loader that loads block data into block maker            =
=====================================================================*/


define(["zone", "marker", "blockColumn", "blockMarker"], function(Zone, Marker, BlockColumn, BlockMarker) {
	var Loader = function(app) {
		this.app = app;
		this.zones = this.app.ZonesCollection;
		this.markers = this.app.MarkersCollection;
		this.blockColumns = this.app.BlockColumnsCollection;
	}

	Loader.prototype.loadFromLocalStorage = function() {
		this.loadData(localStorage.blockApp);
	}

	Loader.prototype.loadData = function(data) {
		this.savedData = JSON.parse(data);
		this.reset();
		this.load();
	}

	Loader.prototype.reset = function() {
		_.invoke(this.markers.toArray(), 'destroy');
		_.invoke(this.zones.toArray(), 'destroy');
	}

	Loader.prototype.load = function() {
		this.loadMarkersAndZones();
		this.loadBlockColumns();
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

	Loader.prototype.loadBlockColumns = function() {
		var self = this;
		this.savedData.blockColumns.forEach(function(blockColumn) {
			var column = new BlockColumn(blockColumn);
			self.blockColumns.add(column);
			blockColumn.blocks.forEach(function(blockData) {
				self.addBlockToColumn(blockData, column);
			});
		});
	}

	Loader.prototype.addBlockToColumn = function(blockData, column) {
		
	}

	return Loader;
});

/*-----  End of Loader that loads block data into block maker  ------*/

