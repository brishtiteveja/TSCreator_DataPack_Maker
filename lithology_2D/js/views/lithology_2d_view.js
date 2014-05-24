define([
	"raphael",
	"baseView",
	"mapView",
	"polygonsView",
	"polygons",
	"animation"
], function(
	Raphael,
	BaseView,
	MapView,
	PolygonsView,
	Polygons,
	Animation
) {

	var Lithology2dView = BaseView.extend({
		el: ".container",
		events: {
			'click a.maker-settings': 'showSettings',
			'click a.maker-tools': 'enableTool',
		}
	});

	Lithology2dView.prototype.initialize = function() {
		this.app = {
			type: "lithology2D"
		}

		this.app.Paper = new Raphael("map", this.$("#display").width(), this.$("#display").height());
		this.app.PolygonsCollection = new Polygons();
		// 
		this.app.animation = new Animation();
		//
		this.app.PolygonSet = this.app.Paper.set();
		this.app.PointSet = this.app.Paper.set();
		this.app.LinesSet = this.app.Paper.set();
		this.PolygonSet = this.app.PolygonSet;
		this.PointSet = this.app.PointSet;
		this.LinesSet = this.app.LinesSet;
		this.app.orderElements = this.orderElements;
		this.loadPatternsDataAndRender();
	}


	Lithology2dView.prototype.loadPatternsDataAndRender = function() {
		var self = this;
		$.get("/pattern_manager/json/patterns.json", function(data) {
			self.app.patternsData = data;
			self.render();
		});
	}

	Lithology2dView.prototype.orderElements = function() {
		this.PolygonSet.toFront();
		this.PointSet.toFront();
		this.LinesSet.toFront();
	}

	Lithology2dView.prototype.render = function() {
		this.mapView = new MapView(this.app);
		this.polygonsView = new PolygonsView(this.app);
	}

	Lithology2dView.prototype.resize = function() {
		this.app.Paper.setSize(this.$("#display").width(), this.$("#display").height());
		this.mapView.renderMap();
	}

	Lithology2dView.prototype.showSettings = function(evt) {
		var id = evt.target.getAttribute('href') + "-list";
		if ($(id).hasClass('active')) {
			$(id).removeClass('active');
			$(evt.target).removeClass('active');
			$(evt.target).parent().removeClass('active');
			this.$('#sections-panel').removeClass('active');
		} else {
			this.$('.settings-content').removeClass('active');
			this.$('.settings-links').removeClass('active');
			this.$('.maker-settings').removeClass('active');
			$(id).addClass('active');
			$(evt.target).addClass('active');
			$(evt.target).parent().addClass('active');
			this.$('#sections-panel').addClass('active');
		}
	}

	Lithology2dView.prototype.enableTool = function(evt) {
		var source = evt.target.getAttribute('href');

		switch (source) {
			case "#add-polygon":
				this.polygonsView.togglePolygons();
				break;
			default:
				break;
		}
	}

	return Lithology2dView;
});