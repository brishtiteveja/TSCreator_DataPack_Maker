define(["raphael", "baseView"], function(Raphael, BaseView) {

	var MapView = BaseView.extend({
		el: "#map",
		events: {
			'dblclick': "addPoint"
		}
	});

	MapView.prototype.initialize = function(app) {
		this.app = app;
		this.app.po = org.polymaps;
		this.app.drag = this.app.po.drag();
		this.app.gridLayer = this.app.po.grid();
		this.app.mapLayer1 = this.app.po.image().url("http://s3.amazonaws.com/com.modestmaps.bluemarble/{Z}-r{Y}-c{X}.jpg");
		this.renderMap();

		this.$el.addClass('hide');
	}

	MapView.prototype.renderMap = function() {
		this.app.map = this.app.po.map()
			.container(this.app.Paper.canvas)
			.zoomRange([0, 9])
			.zoom(7)
			.add(this.app.mapLayer1)
			.add(this.app.po.arrow())
			.add(this.app.po.wheel())
			.add(this.app.drag)
		this.points = [];

	}

	MapView.prototype.addPoint = function(evt) {
		var cdts = {
			x: evt.offsetX,
			y: evt.offsetY
		};

		var wCdts = this.app.map.pointLocation(cdts);
	}

	return MapView;
});