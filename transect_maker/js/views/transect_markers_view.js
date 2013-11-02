/*==========================================
=            TransectMarkersView            =
==========================================*/

var TransectMarkersView = BaseView.extend({
	el: "#markers-list",
	classname: "TransectMarkersView"
})

TransectMarkersView.prototype.template = new EJS({url: '/commons/ejs/data_tbl.ejs'});

TransectMarkersView.prototype.initialize = function() {
	/* initialize the transect makers collection */
	this.transectZones = transectApp.ZonesCollection;
	this.transectMarkers = transectApp.TransectMarkersCollection;
	this.enMarkers = false;

	/* render the transect makers */
	this.render();

	this.listenToActionEvents();

	/* initialize listeners to listen the the changes in markers collection. */
	this.listenTo(this.transectMarkers, "add", this.render.bind(this));
};

TransectMarkersView.prototype.listenToActionEvents = function () {
	$("#canvas").bind('dblclick', this.createMarker.bind(this));
};

TransectMarkersView.prototype.render = function() {
	this.$el.html(this.template.render({name: "Markers"}));
	this.$markersTable = this.$(".data-list");
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
	this.updateZones();
};

TransectMarkersView.prototype.toggleMarkers = function(evt) {
	this.enMarkers = !this.enMarkers;
};

TransectMarkersView.prototype.createMarker = function(evt) {
	if (this.enMarkers) {
		this.transectMarkers.add(new TransectMarker({y: evt.offsetY}));	
	}
};

TransectMarkersView.prototype.updateZones = function() {
	var zones = [];
	this.transectMarkers.each(function(marker, index, markers) {
		if (index > 0) {
			zones.push(new Transect({name: "Zone " + index}, markers[index - 1], marker));
		}
	});
	this.transectZones.reset(zones);
};
/*-----  End of TransectMarkersView  ------*/
