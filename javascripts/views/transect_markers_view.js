/*==========================================
=            TransectMarkersView            =
==========================================*/

var TransectMarkersView = BaseView.extend({
	el: ".container",
	classname: "TransectMarkersView",
	events: {
		'dblclick #canvas': 'createMarker'
	}
})

TransectMarkersView.prototype.makersListTemplate = new EJS({url: '/html/templates/data_tbl.ejs'});

TransectMarkersView.prototype.initialize = function() {
	/* initialize the transect makers collection */
	this.transectMarkers = new TransectMarkers();
	this.enMarkers = false;

	this.$markersList = this.$("#markers-list");

	/* render the transect makers */
	this.render();

	/* initialize listeners to listen the the changes in markers collection. */
	this.listenTo(this.transectMarkers, "add", this.render.bind(this));
};

TransectMarkersView.prototype.render = function() {
	this.$markersList.html(this.makersListTemplate.render({name: "Markers"}));
	this.$markersTable = this.$("#markers-list .data-list");
	this.renderMarkers();
};

TransectMarkersView.prototype.renderMarkers = function() {
	if(this.set === undefined) {
		this.set = Canvas.set();
	}
	this.transectMarkers.each(this.addMarker.bind(this));
};

TransectMarkersView.prototype.addMarker = function(marker) {
	var transectMarkerView = new TransectMarkerView(marker, this);
	this.$markersTable.append(transectMarkerView.el);
	this.set.push(transectMarkerView.element);
};

TransectMarkersView.prototype.toggleMarkers = function(evt) {
	this.enMarkers = !this.enMarkers;
};

TransectMarkersView.prototype.createMarker = function(evt) {
	if (this.enMarkers) {
		this.transectMarkers.add(new TransectMarker({y: evt.offsetY}));	
	}
};
/*-----  End of TransectMarkersView  ------*/
