/*=========================================
=            Points collection            =
=========================================*/

define(["baseCollection", "point"], function(BaseCollection, Point) {
	var Points = BaseCollection.extend({
		classname: "Points",
		model: Point
	});

	Points.prototype.updatePoints = function() {
		this.each(function(point) {
			point.updateTransectAndZone();
		});
		return true;
	}

	/* Override add function to prevent duplicate models in the collection. */

	Points.prototype.add = function(point) {
		if (point === undefined) return;
		
		var isDupe = this.any(function(pt) {
			return ((pt.get('x') == point.get('x')) && (pt.get('y') == point.get('y')));
		});

		if (!isDupe) {
			BaseCollection.prototype.add.call(this, point);
		}
	}

	Points.prototype.getPolyKPointsArray = function() {
		var points = []
		this.each(function(point) {
			points.push(point.get('x'));
			points.push(point.get('y'));
		});
		return points;
	}

	return Points;
});

	/*-----  End of Points  ------*/
