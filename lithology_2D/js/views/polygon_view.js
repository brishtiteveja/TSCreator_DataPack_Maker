define(["baseView", "point", "pointView"], function(BaseView, Point, PointView) {

	var PolygonView = BaseView.extend({});

	PolygonView.prototype.initialize = function(app, polygon) {
		this.app = app;
		this.polygon = polygon;
		this.pointsSet = this.app.Paper.set();
		this.listenToActionEvents();
	}

	PolygonView.prototype.template = new EJS({
		url: '/lithology_2D/ejs/point.ejs'
	});


	PolygonView.prototype.listenToActionEvents = function() {
		// add a point when we double click on canvas.
		this.listenTo(this.polygon.get('points'), 'add', this.addPoint.bind(this));
		this.listenTo(this.polygon.get('points'), 'change', this.renderPolygonElement.bind(this));
		$("#canvas").bind('dblclick', this.createPoint.bind(this));
	}

	PolygonView.prototype.addPoint = function(point) {
		var pointView = new PointView(this.app, point);
		this.renderPolygonElement();
	}

	PolygonView.prototype.renderPolygonElement = function() {
		if (this.element === undefined) {
			this.element = this.app.Paper.path();
		}

		this.element.attr({
			path: this.getPath(),
			stroke: "#ff0000",
			fill: "#ff00ff"
		});
	}

	PolygonView.prototype.createPoint = function(evt) {
		if (!this.polygon.get('draw')) {
			return;
		}

		var cdts = {
			x: evt.offsetX,
			y: evt.offsetY
		};

		var wCdts = this.app.map.pointLocation(cdts);

		var point = this.polygon.get('points').findWhere({
			lat: wCdts.lat,
			lon: wCdts.lon
		}) || new Point({
			x: evt.offsetX,
			y: evt.offsetY,
			lat: wCdts.lat,
			lon: wCdts.lon
		}, this.app);

		this.polygon.get('points').add(point);
	}


	PolygonView.prototype.getPath = function() {
		var path = 'M';
		var self = this;
		this.polygon.get('points').each(function(point, index, points) {
			if (index == 0) {
				path += point.get('x') + ',' + point.get('y');
			} else {
				path += "L" + point.get('x') + ',' + point.get('y');
			}
		});

		path += "Z";
		return path;
	}


	return PolygonView;
});