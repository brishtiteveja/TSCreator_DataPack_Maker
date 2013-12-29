/*========================================
=            Lines Collection            =
========================================*/

define(["baseCollection", "line"], function(BaseCollection, Line) {
	var Lines = BaseCollection.extend({
		classname: "Lines",
		model: Line
	});

	Lines.prototype.findLineForPoints = function(attrs) {
		var point1 = transectApp.PointsCollection.findWhere({x: attrs.x1, y: attrs.y1});
		var point2 = transectApp.PointsCollection.findWhere({x: attrs.x2, y: attrs.y2});
		return this.findWhere({'point1': point1, 'point2': point2});
	}

	return Lines;
});

/*-----  End of Lines Collection  ------*/
