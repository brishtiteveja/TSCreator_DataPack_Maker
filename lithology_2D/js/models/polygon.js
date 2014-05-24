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
				lithologyColumn: null,
				description: params !== undefined && params.description ? params.description : null,
			}];
			BaseModel.apply(this, attrs);
		}
	});


	/* PolyK points array is specific to PolyK library */
	Polygon.prototype.getPolyKPointsArray = function() {
		var array = [];
		this.get('points').each(function(point) {
			array.push(point.get('x'));
			array.push(point.get('y'));
		});
		return array;
	}

	Polygon.prototype.isSimple = function() {
		var pointsArray = this.getPolyKPointsArray();
		return PolyK.IsSimple(pointsArray);
	}

	Polygon.prototype.getAgePatter = function(age) {
		this.get('lithologyColumn')
	}

	Polygon.prototype.toJSON = function() {
		var json = _.clone(this.attributes);
		delete json["lithologyColumn"];
		return json;
	}

	return Polygon;
})