/*=====================================
=            Polygon Model            =
=====================================*/

var Polygon = BaseModel.extend({
	classname: "Polygon",
	constructor: function(attributes, options) {
		var attrs = [{
			edit: false,
			name: attributes && attributes.name ? attributes.name : _.uniqueId("Polygon ")
		}];
		this.settings = new Settings();
		this.points = new Points();
		this.lines = new Lines();
		BaseModel.apply(this, attrs);
	}
});

/*-----  End of Polygon  ------*/

/*===========================================
=            Polygons Collection            =
===========================================*/

var Polygons = BaseCollection.extend({
	classname: "Polygons",
	model: Polygon
});

/*-----  End of Polygons  ------*/

var transectApp = transectApp || {};
transectApp.PolygonsCollection = new Polygons();