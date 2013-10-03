/*===============================================================================================================
=            BlockView is the view that handles changes to the block column it is instantiated with.            =
===============================================================================================================*/

var BlockView = BaseView.extend({
	tagName: 'tr',
	classname: "BlockView",
	events: {
		'click .toggle' : 'toggleBlockForm',
		'click a[href*="update-block"]': 'updateBlock'
	}
});

BlockView.prototype.template = new EJS({url: '/html/templates/block.ejs'});

BlockView.prototype.initialize = function(block, blockColumnView) {
	this.blockColumnView = blockColumnView;
	this.block = block;
	this.x = this.blockColumnView.x;
	this.y = this.blockColumnView.y + Math.round(this.block.get('relativeTopAge')*this.blockColumnView.height); 
	this.width = this.blockColumnView.width;
	this.height = Math.round(this.block.get('relativeBaseAge')*this.blockColumnView.height) - Math.round(this.block.get('relativeTopAge')*this.blockColumnView.height);
	
	/* Render stuff */
	this.render();

	/* Listeners */
	this.listenTo(this.block, 'change:edit', this.editBlockData.bind(this));
};

BlockView.prototype.render = function() {
	this.$el.html(this.template.render(this.block.toJSON()));

	/* Block Item elements  - This should come after render so that it can access those elements. */
	this.$toggle = this.$(".toggle");
	this.$blockForm = this.$(".block-form");
	this.$blockData = this.$(".block-data");
	this.$blockName = this.$('input[name="block-name"]')[0]
	this.$blockTopAge = this.$('input[name="top-age"]')[0]
	this.$blockBaseAge = this.$('input[name="base-age"]')[0]
	this.$blockDescription = this.$('textarea[name="description"]')[0]

	this.renderBlock();
};

BlockView.prototype.renderBlock = function() {

	if (this.set === undefined) {
		this.set = Canvas.set();
	}

	if (this.element === undefined) {
		this.element = Canvas.rect();
		this.set.push(this.element);
		
		if (this.block.get('name') !== undefined && this.block.get('name').toLowerCase() !== "top") {
			this.text = Canvas.text();
			this.set.push(this.text);
		}

		this.hoverBox = Canvas.rect();
		this.set.push(this.hoverBox);
	}

	this.element.attr({
		"x":	this.x,
		"y":	this.y,
		"width":	this.width,
		"height": this.height,
		"fill": this.block.settings.get('backgroundColor')
	});

	this.hoverBox.attr({
		"x":	this.x,
		"y":	this.y,
		"width":	this.width,
		"height": this.height,
		"fill": "#FFFFFF",
		"opacity": 0
	});

	if (this.block.get('name') !== undefined && this.block.get('name').toLowerCase() !== "top") {
		var string = this.wrapString(this.block.get('name'), 15, '-\n', true);
		var textX = this.x + this.width/2;
		var textY = this.y + this.height/2;
		this.text.attr({
			x: textX,
			y: textY,
			text: string
		});
	}

	/* Attach listeners */
	this.hoverBox.hover(this.onMouseOver.bind(this), this.onMouseOut.bind(this));

	/* Render tooltip for the block */
	this.renderTooltip();
};

BlockView.prototype.renderTooltip = function() {
	$(this.hoverBox.node).qtip({
		content: {
			title: this.block.get('name') + "【" + this.block.get('topAge') + " myr →" +  + this.block.get('baseAge') + " myr】",
			text: this.block.get('description')
		},
		position: {
			my: 'middle left', // Position my top left...
			at: 'middle right', // at the bottom right of...
			target: $(this.element.node), // my target 
		}
	});
};

BlockView.prototype.toggleBlockForm = function(evt) {
	this.block.set({
		edit: !this.block.get('edit')
	})
};

BlockView.prototype.editBlockData = function(evt) {
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


BlockView.prototype.updateBlock = function() {
	var name = this.$blockName.value;
	var topAge = parseFloat(this.$blockTopAge.value);
	var baseAge = parseFloat(this.$blockBaseAge.value);
	var description = this.$blockDescription.value;
	this.block.set({
		name: name,
		topAge: topAge,
		baseAge: baseAge,
		description: description
	});
};

BlockView.prototype.onMouseOver = function(evt) {
	if (this.glow === undefined) {
		this.glow = this.element.glow();	
	} else {
		this.glow.show();
	}
	this.element.attr({
		fill: "#C00000",
		opacity: 0.5
	});
};


BlockView.prototype.onMouseOut = function(evt) {
	if (this.glow !== undefined) {
		this.glow.hide();	
	}
	this.element.attr({
		fill: this.block.settings.get('backgroundColor'),
		opacity: 1
	});
};


/*-----  End of BlockView  ------*/

