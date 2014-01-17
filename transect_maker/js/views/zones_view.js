/*=================================
=            ZonesView            =
=================================*/

define(["baseView", "zoneView", "zone"], function(BaseView, ZoneView, Zone) {
	var ZonesView = BaseView.extend({
		el: "#zones-list",
		classname: "ZonesView",
	});

	ZonesView.prototype.template = new EJS({url: '../../../commons/ejs/data_tbl.ejs'});

	ZonesView.prototype.initialize = function(app) {
		this.app = app
		/* initialize the zones view */
		this.zones = this.app.ZonesCollection;

		/* render the dom for the tables */
		this.render();

		this.listenTo(this.zones, "add", this.render.bind(this));
		this.listenTo(this.zones, "reset", this.resetZones.bind(this));
	};

	ZonesView.prototype.render = function() {
		this.$el.html(this.template.render({name: "Zones"}));
		this.$zonesTable = this.$(".data-list");
		this.zones.each(this.addZone.bind(this));
	};

	ZonesView.prototype.addZone = function(zone) {
		var zoneView = new ZoneView(zone);
		this.$zonesTable.append(zoneView.el);
	};

	ZonesView.prototype.resetZones = function() {
		this.$zonesTable.html('');
		this.zones.each(this.addZone, this);
		this.app.PointsCollection.updatePoints();
		this.app.TransectTextsCollection.updateTransectTexts();
	};

	return ZonesView;
});

/*-----  End of ZonesView  ------*/
