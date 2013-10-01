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

	/* Block Item elements  - This should come after render so that it can access those elements. */
	this.$toggle = this.$(".toggle");
	this.$blockForm = this.$(".block-form");
	this.$blockData = this.$(".block-data");
	this.$blockName = this.$('input[name="block-name"]')[0]
	this.$blockTopAge = this.$('input[name="top-age"]')[0]
	this.$blockBaseAge = this.$('input[name="base-age"]')[0]
	this.$blockDescription = this.$('textarea[name="description"]')[0]

	/* Listeners */
	this.listenTo(this.block, 'change:edit', this.editBlockData.bind(this));
};

BlockView.prototype.render = function() {
	this.$el.html(this.template.render(this.block.toJSON()));
	this.renderBlock();
};

BlockView.prototype.renderBlock = function() {

	if (this.set === undefined) {
		this.set = Canvas.set();
	}

	if (this.element === undefined) {
		this.element = Canvas.rect(
			this.x,
			this.y,
			this.width,
			this.height
		);
		this.element.attr({
			"fill": this.block.settings.get('backgroundColor'),
		});
		this.set.push(this.element);
		if (this.block.get('name') !== undefined && this.block.get('name').toLowerCase() !== "top") {
			var string = this.wrapString(this.block.get('name'), 15, '-\n', true);
			var textX = this.x + this.width/2;
			var textY = this.y + this.height/2;
			this.set.push(Canvas.text(textX, textY, string));
		}
		this.element.hover(this.hover.bind(this));
	}	
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
	var topAge = parseInt(this.$blockTopAge.value);
	var baseAge = parseInt(this.$blockBaseAge.value);
	var description = this.$blockDescription.value;
	this.block.set({
		name: name,
		topAge: topAge,
		baseAge: baseAge,
		description: description
	});
};

BlockView.prototype.hover = function(evt) {
	// Canvas.popup(this.x, this.y, this.block.get('description'));
};


/*-----  End of BlockView  ------*/

