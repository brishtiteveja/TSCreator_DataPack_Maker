
/*===============================================================================================================
=            LithologyGroupMarkerView is the view that handles changes to the lithology column it is instantiated with.            =
===============================================================================================================*/

define(["baseView"], function(BaseView) {
	
	var LithologyGroupMarkerView = BaseView.extend({
		classname: "LithologyGroupMarkerView",
	});

	LithologyGroupMarkerView.prototype.statusBoxTemplate = new EJS({url: '/lithology_column_maker/ejs/status_box.ejs'});

	LithologyGroupMarkerView.prototype.initialize = function(app, lithologyGroupMarker) {
		this.app = app;
		this.lithologyGroupMarker = lithologyGroupMarker;

		this.render();

		this.listenTo(this.lithologyGroupMarker.get('lithologyColumn'), 'change:x', this.renderLithologyGroupMarker.bind(this));
		this.listenTo(this.lithologyGroupMarker.get('lithologyColumn'), 'change:width', this.renderLithologyGroupMarker.bind(this));

		/* listen to the events */
		this.listenTo(this.lithologyGroupMarker, 'change:hover', this.setHoverStatus.bind(this));
		this.listenTo(this.lithologyGroupMarker, 'change', this.renderLithologyGroupMarker.bind(this));
		this.listenTo(this.lithologyGroupMarker, 'destroy', this.delete.bind(this));
		this.listenTo(this.lithologyGroupMarker.get('lithologyGroups'), 'remove', this.checkAndDelete.bind(this));
		this.listenTo(this.app.ZonesCollection, 'remove', this.updateLithologyGroupMarker.bind(this));
		this.listenTo(this.app.ZonesCollection, 'change', this.updateLithologyGroupMarker.bind(this));
	};

	LithologyGroupMarkerView.prototype.render = function() {
		this.renderLithologyGroupMarker();
	};

	LithologyGroupMarkerView.prototype.renderLithologyGroupMarker = function() {

		if (this.element === undefined) {
			this.element = this.app.Paper.path();
			
			this.element.attr({
				"stroke-width": 2,
				"stroke": "#0000FF"
			});

			// this.element.click(this.onClick.bind(this));
			this.element.hover(this.onMouseOver.bind(this), this.onMouseOut.bind(this));
			this.element.drag(this.dragMove.bind(this), this.dragStart.bind(this), this.dragEnd.bind(this));

			this.app.LithologyGroupMarkersSet.push(this.element);

			this.app.MarkersSet.toFront();
		}

		var style = this.lithologyGroupMarker.get('style');
		var strokeDashArray = []
		
		if (style === "dashed") {
			strokeDashArray = ["-"];
		} else if (style === "dotted") {
			strokeDashArray = ["."];
		}

		this.element.attr({
			"path": this.getPath(),
			"stroke-dasharray": strokeDashArray,
		});

		this.lithologyGroupMarker.updateZone();
		this.updateStatusBox();
	}

	LithologyGroupMarkerView.prototype.updateStatusBox = function() {
		this.app.StatusBox.html(this.statusBoxTemplate.render(this.lithologyGroupMarker.toJSON()));
	}


	LithologyGroupMarkerView.prototype.getPath = function() {
		var x2 = this.lithologyGroupMarker.get('lithologyColumn').get('x') + Math.round(this.lithologyGroupMarker.get('lithologyColumn').get('width')/2);
		return ("M" + this.lithologyGroupMarker.get('lithologyColumn').get('x') + "," + this.lithologyGroupMarker.get('y') + "H" + x2);
	}

	/*==========  start dragging  ==========*/
	LithologyGroupMarkerView.prototype.dragStart = function(x, y, evt) {
		var markers = this.lithologyGroupMarker.get('lithologyColumn').get('lithologyGroupMarkers');
		var index = markers.indexOf(this.lithologyGroupMarker);
		this.prevMarker = markers.at(index - 1);
		this.nextMarker = markers.at(index + 1);
	};

	/*==========  while dragging  ==========*/
	LithologyGroupMarkerView.prototype.dragMove = function(dx, dy, x, y, evt) {

		if (this.prevMarker && this.nextMarker && (this.prevMarker.get('y') + 2 > evt.offsetY || evt.offsetY > this.nextMarker.get('y') - 2)) {
			return;
		}
		
		if (!this.prevMarker && this.nextMarker && evt.offsetY > this.nextMarker.get('y') - 2) {
			return;
		}

		if (this.prevMarker && !this.nextMarker && this.prevMarker.get('y') + 2 > evt.offsetY) {
			return;
		}

		this.lithologyGroupMarker.set({
			y: evt.offsetY
		});
	};


	LithologyGroupMarkerView.prototype.onMouseOver = function() {
		this.$el.addClass('hover');
		this.lithologyGroupMarker.set({
			hover: true,
		});
	};

	LithologyGroupMarkerView.prototype.onMouseOut = function() {
		this.$el.removeClass('hover');
		this.lithologyGroupMarker.set({
			hover: false,
		});
	};


	LithologyGroupMarkerView.prototype.setHoverStatus = function() {
		if (this.lithologyGroupMarker.get('hover')) {			
			this.element.attr({
				"stroke-width": 5
			});

			this.$el.addClass('hover');
		} else {
			this.element.attr({
				"stroke-width": 2
			});

			this.$el.removeClass('hover');
		}
	}


	LithologyGroupMarkerView.prototype.dragEnd = function(evt) {
	};

	LithologyGroupMarkerView.prototype.delete = function() {
		if (this.element !== undefined) this.element.remove();
		this.$el.remove();
		this.remove();
	}

	LithologyGroupMarkerView.prototype.checkAndDelete = function() {
		if (this.lithologyGroupMarker.get('lithologyGroups').length == 0) {
			this.destroy();
		}
	}

	LithologyGroupMarkerView.prototype.destroy = function() {
		this.lithologyGroupMarker.destroy();
	}

	LithologyGroupMarkerView.prototype.updateLithologyGroupMarker = function(zone) {
		if (zone !== this.lithologyGroupMarker.get('zone')) {
			return;
		}
		this.lithologyGroupMarker.updateZone();
		this.render();

	}

	return LithologyGroupMarkerView;
});

/*-----  End of LithologyGroupMarkerView  ------*/
