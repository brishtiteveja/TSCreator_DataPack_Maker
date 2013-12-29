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
				fill: "#000",
				r: 4,
				stroke: "#000",
				prevFill: "#000",
				prevR: 4,
				prevStroke: "#000",
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

	Point.prototype.normal = function() {
		this.set({
			r : 4,
			fill: "#000000",
			stroke: "#000000"
		});
	}

	Point.prototype.unHover = function() {
		this.set({
			r: this.get('prevR'),
			fill: this.get('prevFill'),
			stroke: this.get('prevStroke'),
		});
	}

	Point.prototype.hover = function() {
		this.set({
			r: 8,
			fill: "#FF0033",
			stroke: '#FF0033',
			prevR: this.get('r'),
			prevFill: this.get('fill'),
			prevStroke: this.get('stroke'),
		});
	}

	Point.prototype.highlightGreen = function() {
		this.set({
			r: 4,
			fill: "#00FF00",
			stroke: "#00FF00"
		});
	}

	Point.prototype.highlightBlue = function() {
		this.set({
			r: 4,
			fill: "#0000FF",
			stroke: "#0000FF",
		});
	}

	return Point;
});
/*-----  End of Point Model  ------*/
