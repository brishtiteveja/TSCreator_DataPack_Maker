define([
	"baseView",
	"polygonView",
	"polygon"
], function(
	BaseView,
	PolygonView,
	Polygon
) {

	var PolygonsView = BaseView.extend({
		el: "#polygons-list"
	});

	PolygonsView.prototype.template = new EJS({
		url: '../../commons/ejs/data_tbl.ejs'
	});

	PolygonsView.prototype.initialize = function(app) {
		this.app = app;
		this.polygonsCollection = app.PolygonsCollection;
		this.listenTo(this.polygonsCollection, 'add', this.addPolygon.bind(this));
		this.render();
	}


	PolygonsView.prototype.render = function() {
		this.$el.html(this.template.render({
			name: "Polygons"
		}));
		this.$polygonsList = this.$(".data-list");
		this.renderPolygons();
	};

	PolygonsView.prototype.renderPolygons = function() {
		this.polygonsCollection.each(this.addPolygon.bind(this));
	}


	PolygonsView.prototype.togglePolygons = function() {
		if ($("a[href='#add-polygon']").parent().hasClass('hide')) {
			$("a[href='#add-polygon']").parent().removeClass('hide');
			$("a[href='#new-polygon']").parent().addClass('hide');
			this.enPolygons = false;
		} else {
			$("a[href='#add-polygon']").parent().addClass('hide');
			$("a[href='#new-polygon']").parent().removeClass('hide');
			this.enPolygons = true;
			this.createPolygon();
		}
	}

	PolygonsView.prototype.createPolygon = function() {
		if (!this.enPolygons) return;

		this.checkAndDeleteCurrentPolygon();

		this.disableAllPolygons();
		this.app.CurrentPolygon = new Polygon();
		this.polygonsCollection.add(this.app.CurrentPolygon);
		this.disableAllPolygons();
		this.app.CurrentPolygon.set({
			'draw': true
		});
	}

	PolygonsView.prototype.createOverlay = function(lithologyColumn) {
		if (!lithologyColumn) return;

		this.checkAndDeleteCurrentPolygon();

		if (!lithologyColumn.get('polygon')) {
			this.app.CurrentPolygon = new Polygon();
			this.polygonsCollection.add(this.app.CurrentPolygon);
			lithologyColumn.set({
				polygon: this.app.CurrentPolygon
			});
			this.app.CurrentPolygon.set({
				lithologyColumn: lithologyColumn
			});
		} else {
			this.app.CurrentPolygon = lithologyColumn.get('polygon');
		}
		this.disableAllPolygons();
		this.app.CurrentPolygon.set({
			'draw': true
		});
		lithologyColumn.update();
	}

	PolygonsView.prototype.disableAllPolygons = function() {
		this.polygonsCollection.each(function(polygon) {
			polygon.set({
				'draw': false
			});
		});
	}

	PolygonsView.prototype.checkAndDeleteCurrentPolygon = function() {
		if (this.app.CurrentPolygon) {
			// unset draw.
			this.app.CurrentPolygon.set({
				'draw': false
			});

			// delete the polygon if the points are less than 3.
			if (this.app.CurrentPolygon.get('points').length < 3) {
				this.app.CurrentPolygon.destroy();
			}
		}
	}

	PolygonsView.prototype.addPolygon = function(polygon) {
		var polygonView = new PolygonView(this.app, polygon);
		this.$polygonsList.append(polygonView.el);
	};
	return PolygonsView;
});
