
/*===============================================================================================================
=            ReferenceBlockView is the view that handles changes to the block column it is instantiated with.            =
===============================================================================================================*/

define(["baseView"], function(BaseView) {
	
	var ReferenceBlockView = BaseView.extend({
		tagName: 'li',
		classname: "ReferenceBlockView",
		events: {
			'click .toggle': 'toggleBlockForm',
			'click .block-data': 'toggleBlockForm',
			'click .destroy': 'destroy',
			'keypress :input': 'updateBlock',
			'keyup :input': 'updateBlock',
			'change input[name="block-color"]': 'updateBlock',
			'change select.block-line-style': 'updateBlock',
			'mouseover': "onMouseOver",
			'mouseout': "onMouseOut",
		}
	});

	ReferenceBlockView.prototype.template = new EJS({url: '/reference_column_maker/ejs/block.ejs'});

	ReferenceBlockView.prototype.initialize = function(app, block) {
		this.app = app;
		this.block = block;
		this.top = this.block.get('top');
		this.base = this.block.get('base');

		if (this.blockSet === undefined) {
			this.blockSet = this.app.Canvas.set();
			this.app.BlocksSet.push(this.blockSet);
		}

		this.render();

		/* listen to the events */
		this.listenTo(this.block, 'change:edit', this.editBlock.bind(this));
		this.listenTo(this.block, 'change:hover', this.setHoverStatus.bind(this));
		this.listenTo(this.block, 'change:name', this.render.bind(this));
		this.listenTo(this.block, 'change:description', this.render.bind(this));
		
		this.listenTo(this.block.get('blockColumn'), 'change:x', this.renderBlock.bind(this));
		this.listenTo(this.block.get('blockColumn'), 'change:width', this.renderBlock.bind(this));

		
		this.listenTo(this.top, 'change:y', this.renderBlock.bind(this));
		this.listenTo(this.top, 'change:age', this.renderTooltip.bind(this));
		this.listenTo(this.base, 'change:y', this.renderBlock.bind(this));
		this.listenTo(this.base, 'change:age', this.renderTooltip.bind(this));
		
		this.listenTo(this.block.get('settings'), 'change', this.renderBlock.bind(this));
		this.listenTo(this.block, 'destroy', this.delete.bind(this));

	};

	ReferenceBlockView.prototype.render = function() {
		this.$el.html(this.template.render(this.block.toJSON()));
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

	ReferenceBlockView.prototype.renderBlock = function() {

		if (this.bgBox === undefined) {
			this.bgBox = this.app.Canvas.rect();
			this.blockText = this.app.Canvas.text();
			this.bBox = this.app.Canvas.rect();
			
			this.blockSet.push(this.bgBox);
			this.blockSet.push(this.blockText);
			this.blockSet.push(this.bBox);

			this.app.MarkersSet.toFront();
			this.app.BlockMarkersSet.toFront();

			this.bBox.hover(this.onMouseOver.bind(this), this.onMouseOut.bind(this));
		}

		this.bgBox.attr({
			"stroke-width" : 0,
			"fill"         : this.block.get('settings').get('backgroundColor'),
			"x"            : this.block.get('blockColumn').get('x'),
			"y"            : this.top.get('y'),
			"width"        : this.block.get('blockColumn').get('width'),
			"height"       : this.base.get('y') - this.top.get('y'),
		});

		var textX = Math.round(this.block.get('blockColumn').get('x') + this.block.get('blockColumn').get('width')/2);
		var textY = Math.round((this.top.get('y') + this.base.get('y'))/2)
		var textSize = Math.min(Math.round(this.base.get('y') - this.top.get('y')), 16);

		this.blockText.attr({
			"x" : textX,
			"y" : textY,
			"text": this.block.get('name'),
			"font-size": textSize,
		});

		this.bBox.attr({
			"stroke-width" : 2,
			"opacity"      : 0,
			"fill"         : "#FFF",
			"x"            : this.block.get('blockColumn').get('x'),
			"y"            : this.top.get('y'),
			"width"        : this.block.get('blockColumn').get('width'),
			"height"       : this.base.get('y') - this.top.get('y'),
		});

		this.renderTooltip();
	}

	ReferenceBlockView.prototype.renderTooltip = function() {
		$(this.bBox.node).qtip({
			content: {
				text: this.block.get('name') + "<br>" + (this.block.get('description') || "No description yet!")
			},
			position: {
				my: 'bottom left', // Position my top left...
				target: 'mouse', // my target 
			}
		});
	};

	ReferenceBlockView.prototype.onMouseOver = function() {
		this.$el.addClass('hover');
		this.block.set({
			hover: true,
		});
	};

	ReferenceBlockView.prototype.onMouseOut = function() {
		this.$el.removeClass('hover');
		this.block.set({
			hover: false,
		});
	};


	ReferenceBlockView.prototype.setHoverStatus = function() {
		if (this.block.get('hover')) {
			this.$el.addClass('hover');
			this.glow  = this.bBox.glow();
		} else {
			if (this.glow) this.glow.remove();
			this.$el.removeClass('hover');
		}
	}

	ReferenceBlockView.prototype.toggleBlockForm = function() {
		this.render();
		this.block.set({
			'edit': !this.block.get('edit')
		});
	};

	ReferenceBlockView.prototype.editBlock = function() {
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

	ReferenceBlockView.prototype.delete = function() {
		if (this.blockText) this.blockText.remove();
		if (this.bgBox) this.bgBox.remove();
		if (this.bBox) this.bBox.remove();
		if (this.glow) this.glow.remove();
		this.$el.remove();
		this.remove();
	}

	ReferenceBlockView.prototype.destroy = function() {
		this.block.get('base').set({
			name: "TOP"
		});
		this.block.destroy();
	}

	ReferenceBlockView.prototype.updateBlock = function(evt) {
		if (evt.keyCode === 13) {
			this.toggleBlockForm();
		}
		var name = this.$blockName.value;
		var description = this.$blockDescription.value;
		var color = this.$blockColor.value;
		var style = this.$("select.block-line-style option:selected").val();
		this.block.set({
			name: name,
			description: description,
		});

		this.block.get('base').set({
			name: name + " Base"
		});

		this.block.get('settings').set({
			backgroundColor: color
		});

		this.base.set({
			style: style
		});
	}
	
	return ReferenceBlockView;
});

/*-----  End of ReferenceBlockView  ------*/
