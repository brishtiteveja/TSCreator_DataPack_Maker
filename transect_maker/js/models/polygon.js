/*=====================================
=            Polygon Model            =
=====================================*/

var Polygon = BaseModel.extend({
	classname: "Polygon",
	constructor: function(attributes, options) {
		var attrs = [{
			edit: false,
			draw: false,
			name: attributes && attributes.name ? attributes.name : _.uniqueId("Polygon "),
			patternName: attributes ? attributes.patternName : null,
			settings: new Settings(),
			points: new Points(),
			lines: new Lines(),
		}];
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