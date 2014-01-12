
/*===============================================================================================================
=            BlockMarkerView is the view that handles changes to the block column it is instantiated with.            =
===============================================================================================================*/

define(["baseView"], function(BaseView) {
	
	var BlockMarkerView = BaseView.extend({
		classname: "BlockMarkerView",
	});

	BlockMarkerView.prototype.initialize = function(app, block) {
		this.app = app;
		this.block = block;

		this.listenTo(this.block.get('blockColumn'), 'change:x', this.renderBlockMarker.bind(this));
		this.listenTo(this.block.get('blockColumn'), 'change:width', this.renderBlockMarker.bind(this));

		this.render();

		/* listen to the events */
		this.listenTo(this.block, 'change:y', this.renderBlockMarker.bind(this));
		this.listenTo(this.block, 'change:hover', this.setHoverStatus.bind(this));
		this.listenTo(this.block, 'destroy', this.delete.bind(this));
	};

	BlockMarkerView.prototype.render = function() {
		this.renderBlockMarker();
	};

	BlockMarkerView.prototype.renderBlockMarker = function() {

		if (this.element === undefined) {
			this.element = this.app.Canvas.path();
			
			this.element.attr({
				"stroke-width": 2,
				"stroke": "#0000FF"
			});

			this.element.hover(this.onMouseOver.bind(this), this.onMouseOut.bind(this));
			this.element.drag(this.dragMove.bind(this), this.dragStart.bind(this), this.dragEnd.bind(this));

			this.app.BlockMarkersSet.push(this.element);

			this.app.MarkersSet.toFront();
		}


		this.element.attr({
			path: this.getPath()
		});
	}


	BlockMarkerView.prototype.getPath = function() {
		var x2 = this.block.get('blockColumn').get('x') + this.block.get('blockColumn').get('width');
		return "M" + this.block.get('blockColumn').get('x') + "," + this.block.get('y') + "H" + x2;
	}

	/*==========  start dragging  ==========*/
	BlockMarkerView.prototype.dragStart = function(x, y, evt) {};

	/*==========  while dragging  ==========*/
	BlockMarkerView.prototype.dragMove = function(dx, dy, x, y, evt) {
		this.block.set({
			y: evt.offsetY
		});
	};


	BlockMarkerView.prototype.onMouseOver = function() {
		this.$el.addClass('hover');
		this.block.set({
			hover: true,
		});
	};

	BlockMarkerView.prototype.onMouseOut = function() {
		this.$el.removeClass('hover');
		this.block.set({
			hover: false,
		});
	};


	BlockMarkerView.prototype.setHoverStatus = function() {
		if (this.block.get('hover')) {			
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

	BlockMarkerView.prototype.destroy = function() {
		this.block.destroy();
	}
	
	return BlockMarkerView;
});

/*-----  End of BlockMarkerView  ------*/
