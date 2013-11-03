/*==================================
=            Line Model            =
==================================*/

var Line = BaseModel.extend({
	classname: "Line",
	constructor: function(attributes, point1, point2) {
		var attrs = [{
			edit: false,
			name: attributes.name || _.uniqueId("Line "),
			pattern: "default", // 0 => default, 1 => jagged, 2=> wavy
			point1: point1,
			point2: point2
		}];
		this.settings = new Settings();
		BaseModel.apply(this, attrs);
	}
});

Line.prototype.getPatternPoints = function() {
	var xs = numeric.linspace(this.point1.get('x'), this.point2.get('x'), steps);
	var ys = numeric.linspace(this.point1.get('y'), this.point2.get('y'), steps);	
}


/*-----  End of Lime Model  ------*/

/*========================================
=            Lines Collection            =
========================================*/

var Lines = BaseCollection.extend({
	classname: "Lines",
	model: Line
});

Lines.prototype.findLineForPoints = function(attrs) {
	var point1 = transectApp.PointsCollection.findWhere({x: attrs.x1, y: attrs.y1});
	var point2 = transectApp.PointsCollection.findWhere({x: attrs.x2, y: attrs.y2});
	return this.findWhere({'point1': point1, 'point2': point2});
}

var transectApp = transectApp || {};
transectApp.LinesCollection = new Lines();
/*-----  End of Lines Collection  ------*/
