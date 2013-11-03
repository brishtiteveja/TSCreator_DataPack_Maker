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
			transect: null
		}];
		BaseModel.apply(this, attrs);
	}
});

Point.prototype.initilize = function() {
};

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