/*====================================
=            PolygonsView            =
====================================*/

define(["baseView", "polygonView", "polygon"], function(BaseView, PolygonView, Polygon) {
	var PolygonsView = BaseView.extend({
		el: "#polygons-list",
		classname: "PolygonsView",
	});

	/* Template for the polygons line the setting panel on the right side */
	PolygonsView.prototype.template = new EJS({url: '/commons/ejs/data_tbl.ejs'});


	PolygonsView.prototype.initialize = function() {
		CurrentPolygon = null;

		this.polygonsCollection = transectApp.PolygonsCollection;

		this.enPolygons = false;

		this.render();
		
		this.listenToActionEvents();

		this.listenTo(this.polygonsCollection, 'add', this.addPolygon.bind(this));
		$('a[href="#new-polygon"]').click(this.createPolygon.bind(this));
	};

	PolygonsView.prototype.render = function(){
		this.$el.html(this.template.render({name: "Polygons"}));
		this.$polygonsList = this.$(".data-list");
		this.renderPolygons();
	};

	PolygonsView.prototype.renderPolygons = function() {
		this.polygonsCollection.each(this.addPolygon.bind(this));
	}

	PolygonsView.prototype.listenToActionEvents = function() {
	}

	PolygonsView.prototype.addPolygon = function(polygon) {
		var polygonView = new PolygonView(polygon);
		this.$polygonsList.append(polygonView.el);
	};

	PolygonsView.prototype.togglePolygons = function() {
		if ($("a[href='#add-polygon']").parent().hasClass('active')) {
			$("a[href='#add-polygon']").parent().removeClass('active');
			this.enPolygons = false;
		} else {
			$("a[href='#add-polygon']").parent().addClass('active');
			this.enPolygons = true;
		}
	}

	PolygonsView.prototype.createPolygon = function() {
		if (!this.enPolygons) return;

		this.checkAndDeleteCurrentPolygon();

		this.disableAllPolygons();
		transectApp.CurrentPolygon = new Polygon();
		this.polygonsCollection.add(transectApp.CurrentPolygon);
		this.disableAllPolygons();
		transectApp.CurrentPolygon.set({
			'draw': true
		});	
	};

	PolygonsView.prototype.checkAndDeleteCurrentPolygon = function() {
		if (transectApp.CurrentPolygon) {
			// unset draw.
			transectApp.CurrentPolygon.set({
				'draw': false
			});	

			// delete the polygon if the points are less than 3.
			if (transectApp.CurrentPolygon.get('points').length < 3) {
				transectApp.CurrentPolygon.destroy();
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

/*-----  End of PolygonsView  ------*/

