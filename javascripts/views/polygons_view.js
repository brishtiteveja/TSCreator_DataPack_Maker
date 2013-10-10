/*====================================
=            PolygonsView            =
====================================*/

var PolygonsView = BaseView.extend({
	el: "#polygons-list",
	classname: "PolygonsView",
});

/* Template for the polygons line the setting panel on the right side */
PolygonsView.prototype.template = new EJS({url: '/html/templates/data_tbl.ejs'});


PolygonsView.prototype.initialize = function() {
	this.polygonsCollection = PolygonsCollection;

	this.render();
	
	this.listenToActionEvents();

	this.listenTo(this.polygonsCollection, 'add', this.addPolygon.bind(this));
};

PolygonsView.prototype.render = function(){
	this.$el.html(this.template.render({name: "Polygons"}));
};

PolygonsView.prototype.listenToActionEvents = function() {
	$('a[href*="polygon"]').bind('click', this.createPolygon.bind(this));
	this.$polygonsList = this.$(".data-list");
}

PolygonsView.prototype.addPolygon = function(polygon) {
	var polygonView = new PolygonView(polygon);
	this.$polygonsList.append(polygonView.el);
};

PolygonsView.prototype.createPolygon = function() {
	var polygon = new Polygon();
	this.polygonsCollection.add(polygon);
	this.polygonsCollection.each(function(polygon) {
		polygon.set('edit', false);
	});
	polygon.set('edit', 'true')
};

/*-----  End of PolygonsView  ------*/

