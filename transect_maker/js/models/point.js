/*===================================
=            Point Model            =
===================================*/

define(["baseModel"], function(BaseModel) {
	var Point = BaseModel.extend({
		classname: "Point",
		constructor: function(attributes, options) {
			var attrs = [{
				edit: false,
				name: attributes.name || _.uniqueId("X"),
				x: attributes.x ? parseInt(attributes.x) : 0,
				y: attributes.y ? parseInt(attributes.y) : 0,
				age: 0,
				relativeX: null,
				relativeY: null,
				relativeAge: null,
				transect: null,
				zone: null,
			}];
			BaseModel.apply(this, attrs);
		}
	});

	Point.prototype.initialize = function() {
		this.updateTransectAndZone();
	};

	Point.prototype.updateTransectAndZone = function() {
		var zone = transectApp.ZonesCollection.getZoneForY(this.get('y'));
		var transect = transectApp.TransectsCollection.getTransectForX(this.get('x'));
		if (zone !== null && transect !== null) {
			this.set({
				transect: transect,
				zone: zone
			});	
			this.updateRelativeCoordinates();
		}
	}

	Point.prototype.updateRelativeCoordinates = function() {
		this.set({
			relativeX: this.get('transect').getRelativeX(this.get('x')),
			relativeY: this.get('zone').getRelativeY(this.get('y')),
			age: this.get('zone').getAbsoluteAge(this.get('y'))
		});
	}

	return Point;
});
/*-----  End of Point Model  ------*/
