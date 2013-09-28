/*===============================================================================================================
=            BlockView is the view that handles changes to the block column it is instantiated with.            =
===============================================================================================================*/

var BlockView = BaseView.extend({
	tagName: 'tr',
	classname: "BlockView",
	block: null,
	events: {
		"click .toggle" : "toggleBlockForm",
	}
});

BlockView.prototype.template = new EJS({url: '/html/templates/block.ejs'});

BlockView.prototype.initialize = function(block, blockColumnView) {
	this.blockColumnView = blockColumnView;
	this.block = block;
	this.x = this.blockColumnView.x;
	this.y = this.blockColumnView.y + Math.round(this.block.relativeTopAge*this.blockColumnView.height); 
	this.width = this.blockColumnView.width;
	this.height = Math.round(this.block.relativeBaseAge*this.blockColumnView.height) - Math.round(this.block.relativeTopAge*this.blockColumnView.height);

	/* Edit form flag */
	this.editForm = false;

	/* Render stuff */
	this.render();

	/* Block Item elements  - This should come after render so that it can access those elements. */
	this.$toggle = this.$(".toggle");
	this.$blockForm = this.$(".block-form");
	this.$blockData = this.$(".block-data");
};

BlockView.prototype.render = function() {
	this.$el.html(this.template.render(this.block));
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
			"fill": this.block.settings.backgroundColor
		});
		this.set.push(this.element);
		if (this.block.name !== undefined && this.block.name.toLowerCase() !== "top") {
			var string = this.wrapString(this.block.name, 15, '-\n', true);
			var textX = this.x + this.width/2;
			var textY = this.y + this.height/2;
			this.set.push(Canvas.text(textX, textY, string));
		}
	}	
};

BlockView.prototype.toggleBlockForm = function(evt) {
	this.editForm = !this.editForm;
	if (this.editForm) {
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
/*-----  End of BlockView  ------*/

