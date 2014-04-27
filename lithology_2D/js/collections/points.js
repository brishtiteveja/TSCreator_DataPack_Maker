define(["baseCollection", "point"], function(BaseCollection, Point) {
	var Points = BaseCollection.extend({
		classname: "Points",
		model: Point
	});

	return Points;
});