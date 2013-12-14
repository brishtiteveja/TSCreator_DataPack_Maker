/*====================================
=            PolygonsView            =
====================================*/

var PolygonsView = BaseView.extend({
	el: "#polygons-list",
	classname: "PolygonsView"
});

/* Template for the polygons line the setting panel on the right side */
PolygonsView.prototype.template = new EJS({url: '/commons/ejs/data_tbl.ejs'});


PolygonsView.prototype.initialize = function() {
	CurrentPolygon = null;

	this.polygonsCollection = transectApp.PolygonsCollection;

	this.render();
	
	this.listenToActionEvents();

	this.listenTo(this.polygonsCollection, 'add', this.addPolygon.bind(this));
};

PolygonsView.prototype.render = function(){
	this.$el.html(this.template.render({name: "Polygons"}));
};

PolygonsView.prototype.listenToActionEvents = function() {
	this.$polygonsList = this.$(".data-list");
}

PolygonsView.prototype.addPolygon = function(polygon) {
	var polygonView = new PolygonView(polygon);
	this.$polygonsList.append(polygonView.el);
};

PolygonsView.prototype.createPolygon = function() {
	if (transectApp.CurrentPolygon == null) {
		transectApp.CurrentPolygon = new Polygon();
		this.polygonsCollection.add(transectApp.CurrentPolygon);
		this.disableAllPolygons();
		transectApp.CurrentPolygon.set({
			'draw': true
		});	
	} else {
		// delete the polygon if the points are less than 3.
		if (transectApp.CurrentPolygon.points.length < 3) {
			transectApp.CurrentPolygon.destroy();
		} else {
			transectApp.CurrentPolygon.set({
				'draw': false
			});	
		}
	}
};

PolygonsView.prototype.disableAllPolygons = function() {	
	this.polygonsCollection.each(function(polygon) {
		polygon.set('draw', false);
	});
}

/*-----  End of PolygonsView  ------*/

