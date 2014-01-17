/*==========================================
=            TransectMarkersView            =
==========================================*/

define(["baseView", "transectMarkerView", "transectMarker", "zone"], function(BaseView, TransectMarkerView, TransectMarker, Zone) {
	var TransectMarkersView = BaseView.extend({
		el: "#markers-list",
		classname: "TransectMarkersView"
	});

	TransectMarkersView.prototype.template = new EJS({url: '../../../commons/ejs/data_tbl.ejs'});

	TransectMarkersView.prototype.initialize = function(app) {
		this.app = app;
		/* initialize the transect makers collection */
		this.transectZones = this.app.ZonesCollection;
		this.transectMarkers = this.app.TransectMarkersCollection;
		this.enMarkers = false;

		/* initialize listeners to listen the the changes in markers collection. */
		this.listenTo(this.transectMarkers, "add", this.render.bind(this));
		this.listenTo(this.transectMarkers, "remove", this.render.bind(this));

		this.listenToActionEvents();

		/* render the transect makers */
		this.render();
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
		this.transectMarkers.each(this.addMarker.bind(this));
	};

	TransectMarkersView.prototype.addMarker = function(marker) {
		var transectMarkerView = new TransectMarkerView(this.app, marker, this);
		this.$markersTable.append(transectMarkerView.el);
		this.updateZones();
	};

	TransectMarkersView.prototype.toggleMarkers = function(evt) {
		if ($("a[href='#add-marker']").parent().hasClass('active')) {
			$("a[href='#add-marker']").parent().removeClass('active');
			this.enMarkers = false;
		} else {
			$("a[href='#add-marker']").parent().addClass('active');
			this.enMarkers = true;
		}
	};

	TransectMarkersView.prototype.createMarker = function(evt) {
		if (this.enMarkers) {
			this.transectMarkers.add(new TransectMarker({y: evt.offsetY}));
		}
	};

	TransectMarkersView.prototype.updateZones = function() {
		var self = this;
		var zonesToDestroy = [];
		this.transectMarkers.sort();
		this.transectMarkers.each(function(marker, index, markers) {
			if (index > 0) {
				var zone = self.transectZones.findWhere({topMarker: markers[index - 1], baseMarker: marker}) || new Zone({name: "New Zone " + index}, markers[index - 1], marker, self.app);
				self.transectZones.add(zone);
				if (index < self.transectMarkers.length - 1) {
					zone = self.transectZones.findWhere({topMarker: markers[index - 1], baseMarker: markers[index + 1]});
					if (zone) {
						zonesToDestroy.push(zone);
					}
				}
			}
		});
		_.invoke(zonesToDestroy, "destroy");
	};

	return TransectMarkersView;
});
/*-----  End of TransectMarkersView  ------*/
