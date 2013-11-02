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
	if (CurrentPolygon == null) {
		CurrentPolygon = new Polygon();
		this.polygonsCollection.add(CurrentPolygon);
		this.disableAllPolygons();
		CurrentPolygon.set({
			'edit': true
		});	
	} else {
		// delete the polygon if the points are less than 3.
		if (CurrentPolygon.points.length < 3) {
			CurrentPolygon.destroy();
		} else {
			CurrentPolygon.set({
				'edit': false
			});	
		}
		CurrentPolygon = null;
	}
};

PolygonsView.prototype.disableAllPolygons = function() {	
	this.polygonsCollection.each(function(polygon) {
		polygon.set('edit', false);
	});
}

/*-----  End of PolygonsView  ------*/

