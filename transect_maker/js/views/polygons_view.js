define(["baseView", "polygonView", "polygon"], function(BaseView, PolygonView, Polygon) {
	var PolygonsView = BaseView.extend({
		el: "#polygons-list",
		classname: "PolygonsView",
	});

	/* Template for the polygons line the setting panel on the right side */
	PolygonsView.prototype.template = new EJS({
		url: '../../commons/ejs/data_tbl.ejs'
	});


	PolygonsView.prototype.initialize = function(app) {
		this.app = app;
		CurrentPolygon = null;

		this.polygonsCollection = this.app.PolygonsCollection;

		this.enPolygons = false;

		this.render();

		this.listenToActionEvents();

		this.listenTo(this.polygonsCollection, 'add', this.addPolygon.bind(this));
	};

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

	PolygonsView.prototype.listenToActionEvents = function() {
		$('a[href="#new-polygon"]').click(this.createPolygon.bind(this));
	}

	PolygonsView.prototype.addPolygon = function(polygon) {
		var polygonView = new PolygonView(this.app, polygon);
		this.$polygonsList.append(polygonView.el);
	};

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
	};

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

	PolygonsView.prototype.disableAllPolygons = function() {
		this.polygonsCollection.each(function(polygon) {
			polygon.set('draw', false);
		});
	}

	return PolygonsView;
});
