/*=====================================
=            Polygon Model            =
=====================================*/

define(["baseModel", "points", "lines"], function(BaseModel, Points, Lines) {
	var Polygon = BaseModel.extend({
		classname: "Polygon",
		constructor: function(attributes, options) {
			var attrs = [{
				edit: false,
				draw: false,
				name: attributes && attributes.name ? attributes.name : _.uniqueId("Polygon "),
				patternName: attributes ? attributes.patternName : null,
				points: new Points(),
				lines: new Lines(),
			}];
			BaseModel.apply(this, attrs);
		}
	});

	/* PolyK points array is specific to PolyK library */
	Polygon.prototype.getPolyKPointsArray = function(arguments) {
		var array = [];
		this.get('points').each(function(point) {
			array.push(point.get('x'));
			array.push(point.get('y'));
		});
		return array;
	}

	return Polygon;
});

/*-----  End of Polygon  ------*/
