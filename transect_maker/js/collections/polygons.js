/*===========================================
=            Polygons Collection            =
===========================================*/

define(["baseCollection", "polygon"], function(BaseCollection, Polygon) {
	var Polygons = BaseCollection.extend({
		classname: "Polygons",
		model: Polygon
	});

	Polygons.prototype.comparator = function(polygon) {
		var points = polygon.get('points');
		var minY = null;
		points.each(function(point) {
			if (minY == null) {
				minY = point.get('y')
			}

			if (point.get('y') < minY) {
				minY = point.get('y');
			}
		});
		return minY;
	}

	return Polygons;
});
/*-----  End of Polygons  ------*/
