
/*===============================================================================================================
=            LithologyMarkerView is the view that handles changes to the lithology column it is instantiated with.            =
===============================================================================================================*/

define(["baseView"], function(BaseView) {
	
	var LithologyMarkerView = BaseView.extend({
		classname: "LithologyMarkerView",
	});

	LithologyMarkerView.prototype.statusBoxTemplate = new EJS({url: '/lithology_column_maker/ejs/status_box.ejs'});

	LithologyMarkerView.prototype.initialize = function(app, lithologyMarker) {
		this.app = app;
		this.lithologyMarker = lithologyMarker;

		this.render();

		this.listenTo(this.lithologyMarker.get('lithologyColumn'), 'change:x', this.renderLithologyMarker.bind(this));
		this.listenTo(this.lithologyMarker.get('lithologyColumn'), 'change:width', this.renderLithologyMarker.bind(this));

		/* listen to the events */
		this.listenTo(this.lithologyMarker, 'change:hover', this.setHoverStatus.bind(this));
		this.listenTo(this.lithologyMarker, 'change', this.renderLithologyMarker.bind(this));
		this.listenTo(this.lithologyMarker, 'destroy', this.delete.bind(this));
		this.listenTo(this.lithologyMarker.get('lithologys'), 'remove', this.checkAndDelete.bind(this));
		this.listenTo(this.app.ZonesCollection, 'remove', this.updateLithologyMarker.bind(this));
		this.listenTo(this.app.ZonesCollection, 'change', this.updateLithologyMarker.bind(this));
	};

	LithologyMarkerView.prototype.render = function() {
		this.renderLithologyMarker();
	};

	LithologyMarkerView.prototype.renderLithologyMarker = function() {

		if (this.element === undefined) {
			this.element = this.app.Canvas.path();
			
			this.element.attr({
				"stroke-width": 2,
				"stroke": "#0000FF"
			});

			// this.element.click(this.onClick.bind(this));
			this.element.hover(this.onMouseOver.bind(this), this.onMouseOut.bind(this));
			this.element.drag(this.dragMove.bind(this), this.dragStart.bind(this), this.dragEnd.bind(this));

			this.app.LithologyMarkersSet.push(this.element);

			this.app.MarkersSet.toFront();
		}

		var style = this.lithologyMarker.get('style');
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

		this.lithologyMarker.updateZone();
		this.updateStatusBox();
	}

	LithologyMarkerView.prototype.updateStatusBox = function() {
		this.app.StatusBox.html(this.statusBoxTemplate.render(this.lithologyMarker.toJSON()));
	}


	LithologyMarkerView.prototype.getPath = function() {
		var x2 = this.lithologyMarker.get('lithologyColumn').get('x') + this.lithologyMarker.get('lithologyColumn').get('width');
		return ("M" + this.lithologyMarker.get('lithologyColumn').get('x') + "," + this.lithologyMarker.get('y') + "H" + x2);
	}

	/*==========  start dragging  ==========*/
	LithologyMarkerView.prototype.dragStart = function(x, y, evt) {
		var markers = this.lithologyMarker.get('lithologyColumn').get('lithologyMarkers');
		var index = markers.indexOf(this.lithologyMarker);
		this.prevMarker = markers.at(index - 1);
		this.nextMarker = markers.at(index + 1);
	};

	/*==========  while dragging  ==========*/
	LithologyMarkerView.prototype.dragMove = function(dx, dy, x, y, evt) {

		if (this.prevMarker && this.nextMarker && (this.prevMarker.get('y') + 2 > evt.offsetY || evt.offsetY > this.nextMarker.get('y') - 2)) {
			return;
		}
		
		if (!this.prevMarker && this.nextMarker && evt.offsetY > this.nextMarker.get('y') - 2) {
			return;
		}

		if (this.prevMarker && !this.nextMarker && this.prevMarker.get('y') + 2 > evt.offsetY) {
			return;
		}

		this.lithologyMarker.set({
			y: evt.offsetY
		});
	};


	LithologyMarkerView.prototype.onMouseOver = function() {
		this.$el.addClass('hover');
		this.lithologyMarker.set({
			hover: true,
		});
	};

	LithologyMarkerView.prototype.onMouseOut = function() {
		this.$el.removeClass('hover');
		this.lithologyMarker.set({
			hover: false,
		});
	};


	LithologyMarkerView.prototype.setHoverStatus = function() {
		if (this.lithologyMarker.get('hover')) {			
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


	LithologyMarkerView.prototype.dragEnd = function(evt) {
	};

	LithologyMarkerView.prototype.delete = function() {
		if (this.element !== undefined) this.element.remove();
		this.$el.remove();
		this.remove();
	}

	LithologyMarkerView.prototype.checkAndDelete = function() {
		if (this.lithologyMarker.get('lithologys').length == 0) {
			this.destroy();
		}
	}

	LithologyMarkerView.prototype.destroy = function() {
		this.lithologyMarker.destroy();
	}

	LithologyMarkerView.prototype.updateLithologyMarker = function(zone) {
		if (zone !== this.lithologyMarker.get('zone')) {
			return;
		}
		this.lithologyMarker.updateZone();
		this.render();

	}

	return LithologyMarkerView;
});

/*-----  End of LithologyMarkerView  ------*/