/*=================================================================
=            Loader that loads tsc data into the maker            =
=================================================================*/

var Loader  = function(transectAppView) {
	this.transectAppView = transectAppView;
	this.data = SampleTransect[0];
	this.width = 500;
	this.render();
};

Loader.prototype.render = function() {
	this.loadMarkers();
	this.loadPolygons(this.data.polygons);
};

Loader.prototype.loadMarkers = function() {

};

Loader.prototype.loadPolygons = function(polygons) {
	var self = this;
	polygons.forEach(function(polygon) {
		self.transectAppView.polygonsView.createPolygon();
		if(transectApp.CurrentPolygon !== null) {
			transectApp.CurrentPolygon.set({
				'name': polygon.name,
				'patternName': polygon.pattern
			});	
			self.loadPolygonPoints(polygon.points);	
			self.transectAppView.polygonsView.createPolygon();
			//self.updatePolygonLines(polygon.lines);
		}
	});
};

Loader.prototype.getXYforPoint = function(point) {
	var self = this;
	var x = Math.round(self.width*point.relativeX);
	var y = Math.round(point.y);
	return [x, y];
}

Loader.prototype.loadPolygonPoints = function(points) {
	var self = this;
	points.forEach(function(point) {
		var xy = self.getXYforPoint(point);
		var x = xy[0];
		var y = xy[1];
		var pt = transectApp.PointsCollection.findWhere({x: x, y: y}) || new Point({x: x, y: y});
		transectApp.CurrentPolygon.points.add(pt);
		transectApp.PointsCollection.add(pt);
	});
};

Loader.prototype.updateLines = function(lines) {
	var self = this;
	lines.forEach(function(line) {
		var p1 = self.getXYforPoint(line.point1);
		var p2 = self.getXYforPoint(line.point2);

	});
}
/*-----  End of Loader that loads tsc data into the maker  ------*/