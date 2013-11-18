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
	this.set({
		transect: transect,
		zone: zone
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

/*-----  End of Points  ------*/

var transectApp = transectApp || {};
transectApp.PointsCollection = new Points();