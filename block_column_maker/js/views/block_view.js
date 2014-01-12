
/*===============================================================================================================
=            BlockView is the view that handles changes to the block column it is instantiated with.            =
===============================================================================================================*/

define(["baseView"], function(BaseView) {
	
	var BlockView = BaseView.extend({
		tagName: 'li',
		classname: "BlockView",
		events: {
			'click .toggle': 'toggleBlockForm',
			'click .block-data': 'toggleBlockForm',
			'click .destroy': 'destroy',
			'keypress :input': 'updateBlock',
			'keyup :input': 'updateBlock',
			'mouseover': "onMouseOver",
			'mouseout': "onMouseOut",
		}
	});

	BlockView.prototype.template = new EJS({url: '/block_column_maker/ejs/block.ejs'});

	BlockView.prototype.initialize = function(app, block) {
		this.app = app;
		this.block = block;
		this.block.update();
		this.topBlock = this.block.get('topBlock');

		this.listenTo(this.block.get('blockColumn'), 'change:x', this.renderBlock.bind(this));
		this.listenTo(this.block.get('blockColumn'), 'change:width', this.renderBlock.bind(this));

		this.render();

		/* listen to the events */
		this.listenTo(this.block, 'change:edit', this.editBlock.bind(this));
		this.listenTo(this.block, 'change:y', this.renderBlock.bind(this));
		this.listenTo(this.block, 'change:age', this.renderBlock.bind(this));
		this.listenTo(this.block, 'change:name', this.renderBlock.bind(this));
		this.listenTo(this.topBlock, 'change:x', this.updateBlockRect.bind(this));
		this.listenTo(this.block, 'change:hover', this.setHoverStatus.bind(this));
		this.listenTo(this.block, 'destroy', this.delete.bind(this));
	};

	BlockView.prototype.render = function() {
		this.$el.html(this.template.render(this.block.toJSON()));
		/* get DOM elements after render */
		this.$toggle = this.$(".toggle");
		this.$blockForm = this.$(".block-form");
		this.$blockData = this.$(".block-data");
		this.$blockName = this.$('input[name="block-name"]')[0];
		this.$blockAge = this.$('input[name="block-age"]')[0];

		/* check edit state */
		this.editBlock();

		this.renderBlock();
	};

	BlockView.prototype.renderBlock = function() {

		if (this.element === undefined) {
			this.element = this.app.Canvas.path();
			this.blockRect = this.app.Canvas.rect(this.block.get('blockColumn').get('x'), this.block.get('y'), this.block.get('blockColumn').get('width'), 0);
			
			this.element.attr({
				"stroke-width": 2,
				"stroke": "#0000FF"
			});

			this.element.hover(this.onMouseOver.bind(this), this.onMouseOut.bind(this));
			this.element.drag(this.dragMove.bind(this), this.dragStart.bind(this), this.dragEnd.bind(this));

			this.app.MarkersSet.toFront();
		}

		this.updateBlockRect();

		this.element.attr({
			path: this.getPath()
		});
	}


	BlockView.prototype.updateBlockRect = function() {
		var topBlock = this.topBlock;
		if (topBlock) {
			this.blockRect.attr({
				y: topBlock.get('y'),
				height: this.block.get('y') - topBlock.get('y'),
				fill: "#ff0000",
			});	
		}
	}

	BlockView.prototype.getPath = function() {
		var x2 = this.block.get('blockColumn').get('x') + this.block.get('blockColumn').get('width');
		return "M" + this.block.get('blockColumn').get('x') + "," + this.block.get('y') + "H" + x2;
	}

	/*==========  start dragging  ==========*/
	BlockView.prototype.dragStart = function(x, y, evt) {};

	/*==========  while dragging  ==========*/
	BlockView.prototype.dragMove = function(dx, dy, x, y, evt) {
		this.block.set({
			y: evt.offsetY
		});
	};


	BlockView.prototype.onMouseOver = function() {
		this.$el.addClass('hover');
		this.block.set({
			hover: true,
		});
	};

	BlockView.prototype.onMouseOut = function() {
		this.$el.removeClass('hover');
		this.block.set({
			hover: false,
		});
	};


	BlockView.prototype.setHoverStatus = function() {
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


	BlockView.prototype.dragEnd = function(evt) {
	};

	BlockView.prototype.toggleBlockForm = function() {
		this.render();
		this.block.set({
			'edit': !this.block.get('edit')
		});
	};

	BlockView.prototype.editBlock = function() {
		if (this.block.get('edit')) {
			this.$blockForm.removeClass('hide');
			this.$blockData.addClass('hide');
			this.$toggle.removeClass('hide-data');
			this.$toggle.addClass('show-data');
		} else {
			this.$blockForm.addClass('hide');
			this.$blockData.removeClass('hide');
			this.$toggle.removeClass('show-data');
			this.$toggle.addClass('hide-data');
		}
	};

	BlockView.prototype.delete = function() {
		if (this.element !== undefined) this.element.remove();
		this.$el.remove();
		this.remove();
	}

	BlockView.prototype.destroy = function() {
		this.block.destroy();
	}
	
	return BlockView;
});

/*-----  End of BlockView  ------*/
