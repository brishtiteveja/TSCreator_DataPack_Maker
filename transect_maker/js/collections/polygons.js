/*===========================================
=            Polygons Collection            =
===========================================*/

define(["baseCollection", "polygon"], function(BaseCollection, Polygon) {
	var Polygons = BaseCollection.extend({
		classname: "Polygons",
		model: Polygon,
		comparator: function(polygon) {
			var points = polygon.get('points');
			var minY = Infinity;
			points.each(function(point) {
				if (point.get('y') <= minY) {
					minY = point.get('y');
				}
			});
			return minY;
		},
	});

	return Polygons;
});
/*-----  End of Polygons  ------*/
