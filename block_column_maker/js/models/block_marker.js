/*======================================================================
=            BlockMarker to represent the block boundaries.            =
======================================================================*/

define(["baseModel", "blocks"], function(BaseModel, Blocks) {

	var BlockMarker = BaseModel.extend({
		classname: "BlockMarker",
		constructor: function (attributes, app) {
			var attrs = [{
				edit          : false,
				hover         : false,
				y             : parseInt(attributes.y),
				id            : _.uniqueId("block-marker-"),
				baseAge       : null,
				relativeBaseY : null,
				blockColumn   : attributes.blockColumn || null,
				app           : app || null,
				zone          : null,
				blocks        : new Blocks(),
			}];
			BaseModel.apply(this, attrs);
		}
	});

	BlockMarker.prototype.initialize = function() {
		this.updateZone();
	}

	BlockMarker.prototype.updateZone = function() {
		var zone = this.get('app').ZonesCollection.getZoneForY(this.get('y'));
		if (zone !== null) {
			this.set({
				zone: zone
			});	
			this.updateRelativeCoordinates();
		}
	}

	BlockMarker.prototype.updateRelativeCoordinates = function() {
		this.set({
			relativeY: this.get('zone').getRelativeY(this.get('y')),
			age: this.get('zone').getAbsoluteAge(this.get('y'))
		});
	}
	
	return BlockMarker;
});

/*-----  End of BlockMarker to represent the block boundaries.  ------*/

