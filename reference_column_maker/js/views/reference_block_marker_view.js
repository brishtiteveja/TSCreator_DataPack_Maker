
/*===============================================================================================================
=            ReferenceBlockMarkerView is the view that handles changes to the block column it is instantiated with.            =
===============================================================================================================*/

define(["baseView"], function(BaseView) {
	
	var ReferenceBlockMarkerView = BaseView.extend({
		classname: "ReferenceBlockMarkerView",
	});

	ReferenceBlockMarkerView.prototype.statusBoxTemplate = new EJS({url: '/reference_column_maker/ejs/status_box.ejs'});

	ReferenceBlockMarkerView.prototype.initialize = function(app, blockMarker) {
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

		this.render();
	};

	ReferenceBlockMarkerView.prototype.render = function() {
		this.renderBlockMarker();
	};

	ReferenceBlockMarkerView.prototype.renderBlockMarker = function() {

		if (this.element === undefined) {
			this.element = this.app.Canvas.path();
			
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

		if (this.blockMarker.get('marker')) {
			this.listenTo(this.blockMarker.get('marker'), 'change:y', this.updateBlockMakereY.bind(this));	
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


		this.resizeCanvas();
		this.updateStatusBox();
		this.renderTooltip();
	}

	ReferenceBlockMarkerView.prototype.renderTooltip = function() {
		var self = this;
		$(this.element.node).qtip({
			content: {
				text: this.blockMarker.get('name') + "(" + this.blockMarker.get('age') + " myr )"
			},
			position: {
				my: 'bottom left', // Position my top left...
				target: 'mouse', // my target 
			}
		});
	};

	ReferenceBlockMarkerView.prototype.resizeCanvas = function() {
		var height = Math.max(this.app.Canvas.height, this.blockMarker.get('y') + 100)
		this.blockMarker.get('blockColumn').set({
			height: height
		});

		this.app.Canvas.setSize(this.app.Canvas.width, height);
	}

	ReferenceBlockMarkerView.prototype.updateBlockMakereY = function() {
		if (this.blockMarker.get('marker')) {
			this.blockMarker.set({
				y: this.blockMarker.get('marker').get('y')
			});
		}
	}

	ReferenceBlockMarkerView.prototype.updateStatusBox = function() {
		if (this.app.StatusBox) {
			this.app.StatusBox.html(this.statusBoxTemplate.render(this.blockMarker.toJSON()));	
		}
	}


	ReferenceBlockMarkerView.prototype.getPath = function() {
		var x2 = this.blockMarker.get('blockColumn').get('x') + this.blockMarker.get('blockColumn').get('width');
		return ("M" + this.blockMarker.get('blockColumn').get('x') + "," + this.blockMarker.get('y') + "H" + x2);
	}

	/*==========  start dragging  ==========*/
	ReferenceBlockMarkerView.prototype.dragStart = function(x, y, evt) {
		var markers = this.blockMarker.get('blockColumn').get('blockMarkers');
		var index = markers.indexOf(this.blockMarker);
		this.prevMarker = markers.at(index - 1);
		this.nextMarker = markers.at(index + 1);
	};

	/*==========  while dragging  ==========*/
	ReferenceBlockMarkerView.prototype.dragMove = function(dx, dy, x, y, evt) {

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


	ReferenceBlockMarkerView.prototype.onMouseOver = function() {
		this.$el.addClass('hover');
		this.blockMarker.set({
			hover: true,
		});
	};

	ReferenceBlockMarkerView.prototype.onMouseOut = function() {
		this.$el.removeClass('hover');
		this.blockMarker.set({
			hover: false,
		});
	};


	ReferenceBlockMarkerView.prototype.setHoverStatus = function() {
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


	ReferenceBlockMarkerView.prototype.dragEnd = function(evt) {
	};

	ReferenceBlockMarkerView.prototype.delete = function() {
		if (this.element !== undefined) this.element.remove();
		this.$el.remove();
		this.remove();
	}

	ReferenceBlockMarkerView.prototype.checkAndDelete = function() {
		if (this.blockMarker.get('blocks').length == 0) {
			this.destroy();
		}
	}

	ReferenceBlockMarkerView.prototype.destroy = function() {
		this.blockMarker.destroy();
	}

	return ReferenceBlockMarkerView;
});

/*-----  End of ReferenceBlockMarkerView  ------*/
