
/*===============================================================================================================
=            BlockMarkerView is the view that handles changes to the block column it is instantiated with.            =
===============================================================================================================*/

define(["baseView"], function(BaseView) {
	
	var BlockMarkerView = BaseView.extend({
		classname: "BlockMarkerView",
	});

	BlockMarkerView.prototype.statusBoxTemplate = new EJS({url: '/block_column_maker/ejs/status_box.ejs'});

	BlockMarkerView.prototype.initialize = function(app, blockMarker) {
		this.app = app;
		this.blockMarker = blockMarker;

		this.render();

		this.listenTo(this.blockMarker.get('blockColumn'), 'change:x', this.renderBlockMarker.bind(this));
		this.listenTo(this.blockMarker.get('blockColumn'), 'change:width', this.renderBlockMarker.bind(this));

		/* listen to the events */
		this.listenTo(this.blockMarker, 'change:hover', this.setHoverStatus.bind(this));
		this.listenTo(this.blockMarker, 'change', this.renderBlockMarker.bind(this));
		this.listenTo(this.blockMarker, 'destroy', this.delete.bind(this));
		this.listenTo(this.blockMarker.get('blocks'), 'remove', this.checkAndDelete.bind(this));
		this.listenTo(this.app.ZonesCollection, 'remove', this.updateBlockMarker.bind(this));
		this.listenTo(this.app.ZonesCollection, 'change', this.updateBlockMarker.bind(this));
	};

	BlockMarkerView.prototype.render = function() {
		this.renderBlockMarker();
	};

	BlockMarkerView.prototype.renderBlockMarker = function() {

		if (this.element === undefined) {
			this.element = this.app.Paper.path();
			
			this.element.attr({
				"stroke-width": 2,
				"stroke": "#0000FF"
			});

			// this.element.click(this.onClick.bind(this));
			this.element.hover(this.onMouseOver.bind(this), this.onMouseOut.bind(this));
			this.element.drag(this.dragMove.bind(this), this.dragStart.bind(this), this.dragEnd.bind(this));

			this.app.BlockMarkersSet.push(this.element);

			this.app.MarkersSet.toFront();
		}

		var style = this.blockMarker.get('style');
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

		this.blockMarker.updateZone();
		this.updateStatusBox();
	}

	BlockMarkerView.prototype.updateStatusBox = function() {
		this.app.StatusBox.html(this.statusBoxTemplate.render(this.blockMarker.toJSON()));
	}


	BlockMarkerView.prototype.getPath = function() {
		var x2 = this.blockMarker.get('blockColumn').get('x') + this.blockMarker.get('blockColumn').get('width');
		return ("M" + this.blockMarker.get('blockColumn').get('x') + "," + this.blockMarker.get('y') + "H" + x2);
	}

	/*==========  start dragging  ==========*/
	BlockMarkerView.prototype.dragStart = function(x, y, evt) {
		var markers = this.blockMarker.get('blockColumn').get('blockMarkers');
		var index = markers.indexOf(this.blockMarker);
		this.prevMarker = markers.at(index - 1);
		this.nextMarker = markers.at(index + 1);
	};

	/*==========  while dragging  ==========*/
	BlockMarkerView.prototype.dragMove = function(dx, dy, x, y, evt) {

		if (this.prevMarker && this.nextMarker && (this.prevMarker.get('y') + 2 > evt.offsetY || evt.offsetY > this.nextMarker.get('y') - 2)) {
			return;
		}
		
		if (!this.prevMarker && this.nextMarker && evt.offsetY > this.nextMarker.get('y') - 2) {
			return;
		}

		if (this.prevMarker && !this.nextMarker && this.prevMarker.get('y') + 2 > evt.offsetY) {
			return;
		}

		this.blockMarker.set({
			y: evt.offsetY
		});
	};


	BlockMarkerView.prototype.onMouseOver = function() {
		this.$el.addClass('hover');
		this.blockMarker.set({
			hover: true,
		});
	};

	BlockMarkerView.prototype.onMouseOut = function() {
		this.$el.removeClass('hover');
		this.blockMarker.set({
			hover: false,
		});
	};


	BlockMarkerView.prototype.setHoverStatus = function() {
		if (this.blockMarker.get('hover')) {			
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


	BlockMarkerView.prototype.dragEnd = function(evt) {
	};

	BlockMarkerView.prototype.delete = function() {
		if (this.element !== undefined) this.element.remove();
		this.$el.remove();
		this.remove();
	}

	BlockMarkerView.prototype.checkAndDelete = function() {
		if (this.blockMarker.get('blocks').length == 0) {
			this.destroy();
		}
	}

	BlockMarkerView.prototype.destroy = function() {
		this.blockMarker.destroy();
	}

	BlockMarkerView.prototype.updateBlockMarker = function(zone) {
		if (zone !== this.blockMarker.get('zone')) {
			return;
		}
		this.blockMarker.updateZone();
		this.render();

	}

	return BlockMarkerView;
});

/*-----  End of BlockMarkerView  ------*/
