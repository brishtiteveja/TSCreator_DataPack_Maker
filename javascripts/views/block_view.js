/*===============================================================================================================
=            BlockView is the view that handles changes to the block column it is instantiated with.            =
===============================================================================================================*/

var BlockView = BaseView.extend({
	el: "#canvas",
	classname: "BlockView",
	block: null,
});

BlockView.prototype.initialize = function(block, blockColumnView) {
	this.blockColumnView = blockColumnView;
	this.block = block;
	this.x = this.blockColumnView.x;
	this.y = this.blockColumnView.y + Math.round(this.block.relativeTopAge*this.blockColumnView.height); 
	this.width = this.blockColumnView.width;
	this.height = Math.round(this.block.relativeBaseAge*this.blockColumnView.height) - Math.round(this.block.relativeTopAge*this.blockColumnView.height);
	this.render();
};

BlockView.prototype.render = function() {

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

/*-----  End of BlockView  ------*/

