/*==========================================
=            MarkersView            =
==========================================*/

define(["baseView", "markerView", "marker", "zone"], function(BaseView, MarkerView, Marker, Zone) {
	var MarkersView = BaseView.extend({
		el: "#markers-list",
		classname: "MarkersView"
	});

	MarkersView.prototype.template = new EJS({url: '/commons/ejs/data_tbl.ejs'});

	MarkersView.prototype.initialize = function(app) {
		this.app = app;
		/* initialize the block markers collection */
		this.zones = this.app.ZonesCollection;
		this.markers = this.app.MarkersCollection;
		this.enMarkers = false;

		/* initialize listeners to listen the the changes in markers collection. */
		this.listenTo(this.markers, "add", this.render.bind(this));
		this.listenTo(this.markers, "remove", this.render.bind(this));

		this.listenToActionEvents();

		/* render the block markers */
		this.render();
	};

	MarkersView.prototype.listenToActionEvents = function () {
		$("#canvas").bind('dblclick', this.createMarker.bind(this));
	};

	MarkersView.prototype.render = function() {
		this.$el.html(this.template.render({name: "Markers"}));
		this.$markersTable = this.$(".data-list");
		this.renderMarkers();
	};

	MarkersView.prototype.renderMarkers = function() {
		this.markers.each(this.addMarker.bind(this));
	};

	MarkersView.prototype.addMarker = function(marker) {
		var markerView = new MarkerView(this.app, marker, this);
		this.$markersTable.append(markerView.el);
		this.updateZones();
	};

	MarkersView.prototype.toggleMarkers = function(evt) {
		if ($("a[href='#add-marker']").parent().hasClass('active')) {
			$("a[href='#add-marker']").parent().removeClass('active');
			this.enMarkers = false;
		} else {
			$("a[href='#add-marker']").parent().addClass('active');
			this.enMarkers = true;
		}
	};

	MarkersView.prototype.createMarker = function(evt) {
		if (this.enMarkers) {
			this.markers.add(new Marker({y: evt.offsetY}));
		}
	};

	MarkersView.prototype.updateZones = function() {
		var self = this;
		var zones = [];
		this.markers.each(function(marker, index, markers) {
			if (index > 0) {
				zones.push(new Zone({name: "Zone " + index}, markers[index - 1], marker, self.app));
			}
		});
		var previousZones = _.clone(this.zones);
		this.zones.reset(zones);
		// update zones with name
		this.zones.each(function(zone) {
			var prevZone = previousZones.findWhere({topMarker: zone.get('topMarker'), baseMarker: zone.get('baseMarker')});
			if (prevZone) {
				zone.set({
					name: prevZone.get('name'),
					description: prevZone.get('description'),
				});
			}
		});
	};

	return MarkersView;
});
/*-----  End of MarkersView  ------*/
