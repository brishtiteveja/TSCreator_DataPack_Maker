define(["raphael", "baseView"], function(Raphael, BaseView) {

	var MapView = BaseView.extend({
		el: "#canvas",
		events: {
			'dblclick': "addPoint"
		}
	});

	MapView.prototype.initialize = function(app) {
		this.app = app;
		this.app.po = org.polymaps;
		this.app.map = this.app.po.map()
			.container(this.app.Paper.canvas)
			.zoomRange([2, 9])
			.zoom(7)
			.add(this.app.po.image().url("http://s3.amazonaws.com/com.modestmaps.bluemarble/{Z}-r{Y}-c{X}.jpg"))
			.add(this.app.po.arrow())
			.add(this.app.po.wheel())
			.add(this.app.po.drag())
			.add(this.app.po.grid());

		this.points = [];
	}

	MapView.prototype.addPoint = function(evt) {
		var cdts = {
			x: evt.offsetX,
			y: evt.offsetY
		};

		var wCdts = this.app.map.pointLocation(cdts);
	}

	MapView.prototype.change = function(evt) {}

	return MapView;
});