define(["baseCollection", "polygon"], function(BaseCollection, Polygon) {
	var Polygons = BaseCollection.extend({
		classname: "Polygons",
		model: Polygon
	});

	return Polygons;
});