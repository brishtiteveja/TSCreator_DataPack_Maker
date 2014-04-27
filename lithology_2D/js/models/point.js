define(["baseModel"], function(BaseModel) {
	var Point = BaseModel.extend({
		classname: "Point",
		constructor: function(params, app) {
			var attrs = [{
				edit: false,
				name: params.name || _.uniqueId("X"),
				x: params.x ? parseInt(params.x) : 0,
				y: params.y ? parseInt(params.y) : 0,
				lat: params.lat,
				lon: params.lon,
				app: app
			}];
			BaseModel.apply(this, attrs);
		}
	});

	return Point;
});