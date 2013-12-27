/*===================================
=            Point Model            =
===================================*/

var Point = BaseModel.extend({
	classname: "Point",
	constructor: function(attributes, options) {
		var attrs = [{
			edit: false,
			name: attributes.name || _.uniqueId("Point "),
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

/*-----  End of Point Model  ------*/

/*=========================================
=            Points collection            =
=========================================*/

var Points = BaseCollection.extend({
	classname: "Points",
	model: Point
});

Points.prototype.updatePoints = function() {
	this.each(function(point) {
		point.updateTransectAndZone();
	});
	return true;
}

/* Override add function to prevent duplicate models in the collection. */

Points.prototype.add = function(point) {
	if (point === undefined) return;
	
	var isDupe = this.any(function(pt) {
		return ((pt.get('x') == point.get('x')) && (pt.get('y') == point.get('y')));
	});

	if (!isDupe) {
		BaseCollection.prototype.add.call(this, point);
	}
}

Points.prototype.getPolyKPointsArray = function() {
	var points = []
	this.each(function(point) {
		points.push(point.get('x'));
		points.push(point.get('y'));
	});
	return points;
}

/*-----  End of Points  ------*/

var transectApp = transectApp || {};
transectApp.PointsCollection = new Points();