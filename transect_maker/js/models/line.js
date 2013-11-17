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
		this.polygons = new Polygons();
		this.settings = new Settings();
		BaseModel.apply(this, attrs);
	}
});

Line.prototype.jaggedDistance = 10;
Line.prototype.waveHeight = 5;

Line.prototype.getPatternPoints = function() {
	var xs = numeric.linspace(this.point1.get('x'), this.point2.get('x'), steps);
	var ys = numeric.linspace(this.point1.get('y'), this.point2.get('y'), steps);	
}


Line.prototype.getPath = function() {
	return this.getPathFromPattern(this.get('pattern'));
};

Line.prototype.getPathFromPattern = function(pattern) {
	switch (pattern) {
		case "default":
			return this.getStraightPath();
			break;
		case "jagged":
			return this.getJaggedPath();;
			break;
		case "wavy":
			return this.getWavyPath();;
			break;
		case "lapping":
			return this.getJaggedPath();;
			break;
	}
}

Line.prototype.getStraightPath = function() {
	var path = ",L" + this.get("point2").get('x') + "," + this.get("point2").get('y');
	return path;
};

Line.prototype.getJaggedPath = function() {
	var slopeNumerator = (this.get("point1").get('y') - this.get("point2").get('y'));
	var slopeDenominator = (this.get("point1").get('x') - this.get("point2").get('x'));
	var slope = slopeNumerator/slopeDenominator;
	var steps = Math.round(Math.abs(this.get("point1").get('y') - this.get("point2").get('y')) / 10);
	var xs = numeric.linspace(this.get("point1").get('x'), this.get("point2").get('x'), steps);
	var ys = numeric.linspace(this.get("point1").get('y'), this.get("point2").get('y'), steps);
	var path = "";
	
	if (xs.length == 0) {
		return this.getStraightPath();
	}

	for (var i = 0; i < xs.length; i++) {
		if (i == 0) {
		} else {
			if ((slopeNumerator > 0 && slope > 0) || (slopeNumerator < 0 && slope < 0)) {
				path += ',L' + (xs[i-1] + this.jaggedDistance) + ',' + ys[i - 1];
				path += ',L' + (xs[i] - this.jaggedDistance) + ',' + ys[i];
				if (i < xs.length - 1) {
					path += ',L' + (xs[i] + this.jaggedDistance) + ',' + ys[i];	
				} else {
					path += ',L' + xs[i] + "," + ys[i];
				}
			} else {	
				path += ',L' + (xs[i-1] - this.jaggedDistance) + ',' + ys[i - 1];
				path += ',L' + (xs[i] + this.jaggedDistance) + ',' + ys[i];
				if (i < xs.length - 1) {
					path += ',L' + (xs[i] - this.jaggedDistance) + ',' + ys[i];	
				} else {
					path += ',L' + xs[i] + "," + ys[i];
				}
			}
		}
	}
	return path;
};

Line.prototype.getWavyPath = function() {
	var stepsY = Math.round(Math.abs(this.get("point1").get('y') - this.get("point2").get('y')) / 3);
	var stepsX = Math.round(Math.abs(this.get("point1").get('x') - this.get("point2").get('x')) / 3);
	var steps = Math.max(stepsX, stepsY);

	var xs = numeric.linspace(this.get("point1").get('x'), this.get("point2").get('x'), steps);
	var ys = numeric.linspace(this.get("point1").get('y'), this.get("point2").get('y'), steps);
	var path = "";
	
	if ( steps == 0) {
		return this.getStraightPath();
	}

	for (var i = 0; i < steps; i++) {
		var x = xs.length > 0 ? xs[i] : this.get("point1").get('x');
		var y = ys.length > 0 ? ys[i] : this.get("point1").get('y');

		if (i == 0) {
		} else {
			if (i%2 == 1) {
				if (i%4 == 3) {
					plPoint = this.pointAtADistanceFromXY(x, y, -this.waveHeight);
				} else {
					plPoint = this.pointAtADistanceFromXY(x, y, this.waveHeight);
				}
				path += ",S" + plPoint[0] + "," + plPoint[1];
			} else {
				path += "," + x + "," + y;
			}
		}
	}
	path += ",L" + this.get("point2").get('x') + "," + this.get("point2").get('y');
	return path;
};

Line.prototype.pointAtADistanceFromXY = function(x, y, dist) {
	var slope = (this.get('point1').get('x') - this.get('point2').get('x'))/(this.get('point2').get('y') - this.get('point1').get('y'));
	var x_, y_;
	if (slope === Infinity || slope === -Infinity) {
		x_ = x;
		y_ = y + dist;
	} else {
		x_ = x + dist/Math.sqrt(1 + slope*slope);
		y_ = y + slope*(x_ - x);
	}
	return [x_, y_]
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
