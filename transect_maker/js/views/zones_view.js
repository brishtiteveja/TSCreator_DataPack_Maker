/*=================================
=            ZonesView            =
=================================*/

var ZonesView = BaseView.extend({
	el: "#zones-list",
	classname: "ZonesView",
});

ZonesView.prototype.template = new EJS({url: '../../../commons/ejs/data_tbl.ejs'});

ZonesView.prototype.initialize = function() {
	/* initialize the zones view */
	this.zones = transectApp.ZonesCollection;

	/* render the dom for the tables */
	this.render();

	this.listenTo(this.zones, "add", this.addZone.bind(this));
	this.listenTo(this.zones, "reset", this.resetZones.bind(this));
};

ZonesView.prototype.render = function() {
	this.$el.html(this.template.render({name: "Zones"}));
	this.$zonesTable = this.$(".data-list");
};

ZonesView.prototype.addZone = function(zone) {
	var zoneView = new ZoneView(zone);
	this.$zonesTable.append(zoneView.el);
};

ZonesView.prototype.resetZones = function() {
	this.$zonesTable.html('');
	this.zones.each(this.addZone, this);
};

/*-----  End of ZonesView  ------*/
