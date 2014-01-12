
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
		this.top = this.block.get('top');
		this.base = this.block.get('base');

		this.render();

		/* listen to the events */
		this.listenTo(this.block.get('blockColumn'), 'change:x', this.renderBlock.bind(this));
		this.listenTo(this.block.get('blockColumn'), 'change:width', this.renderBlock.bind(this));
		this.listenTo(this.block, 'change:edit', this.editBlock.bind(this));
		this.listenTo(this.block, 'change:hover', this.setHoverStatus.bind(this));
		this.listenTo(this.top, 'change:y', this.renderBlock.bind(this));
		this.listenTo(this.base, 'change:y', this.renderBlock.bind(this));
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
		this.$blockColor = this.$('input[name="block-color"]')[0];
		this.$blockDescription = this.$('textarea[name="block-description"]')[0];

		/* check edit state */
		this.editBlock();

		this.renderBlock();
	};

	BlockView.prototype.renderBlock = function() {

		if (this.element === undefined) {
			this.element = this.app.Canvas.rect();
			this.element.hover(this.onMouseOver.bind(this), this.onMouseOut.bind(this));
			this.app.BlocksSet.push(this.element);
			this.app.MarkersSet.toFront();
			this.app.BlockMarkersSet.toFront();
		}

		this.element.attr({
			"stroke-width" : 0,
			"fill"         : "#FF0000",
			"x"            : this.block.get('blockColumn').get('x'),
			"y"            : this.top.get('y'),
			"width"        : this.block.get('blockColumn').get('width'),
			"height"       : this.base.get('y') - this.top.get('y'),
		});
	}

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
			this.$el.addClass('hover');
		} else {
			this.$el.removeClass('hover');
		}
	}

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

	BlockView.prototype.updateBlock = function() {s
		if (evt.keyCode === 13) {
			this.toggleBlockForm();
		}
		var name = this.$blockName.value;
		var description = this.$blockDescription.value;
		var color = this.$blockColor.value;
		this.block.set({
			name: name,
			description: description,
			color: color,
		});
	}
	
	return BlockView;
});

/*-----  End of BlockView  ------*/
