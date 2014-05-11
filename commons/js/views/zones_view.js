define(["baseView", "zoneView", "zone"], function(BaseView, ZoneView, Zone) {
	var ZonesView = BaseView.extend({
		el: "#zones-list",
		classname: "ZonesView",
	});

	ZonesView.prototype.template = new EJS({
		url: '../../../commons/ejs/data_tbl.ejs'
	});

	ZonesView.prototype.initialize = function(app) {
		this.app = app
		/* initialize the zones view */
		this.zones = this.app.ZonesCollection;

		/* render the dom for the tables */
		this.render();

		this.listenTo(this.zones, "add", this.render.bind(this));
	};

	ZonesView.prototype.render = function() {
		this.$el.html(this.template.render({
			name: "Zones"
		}));
		this.$zonesTable = this.$(".data-list");
		this.zones.each(this.addZone.bind(this));
	};

	ZonesView.prototype.addZone = function(zone) {
		var zoneView = new ZoneView(zone);
		this.$zonesTable.append(zoneView.el);
	};

	return ZonesView;
});