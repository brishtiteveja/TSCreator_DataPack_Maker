define(["baseModel", "points", "polyK"], function(BaseModel, Points, PolyK) {
	var Polygon = BaseModel.extend({
		constructor: function(params, options) {
			var attrs = [{
				id: _.uniqueId("polygon_"),
				hover: false,
				edit: false,
				draw: false,
				toFront: false,
				name: params && params.name ? params.name : _.uniqueId("Polygon "),
				patternName: params ? params.patternName : null,
				points: new Points(),
				topAge: params ? params.topAge : null,
				baseAge: params ? params.baseAge : null,
				description: params !== undefined && params.description ? params.description : null,
			}];
			BaseModel.apply(this, attrs);
		}
	});

	return Polygon;
})