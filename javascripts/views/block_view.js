/*===============================================================================================================
=            BlockView is the view that handles changes to the block column it is instantiated with.            =
===============================================================================================================*/

var BlockView = BaseView.extend({
	el: "#canvas",
	classname: "BlockView",
	block: null,
	x: 0,
	y: 0,
});

BlockView.prototype.initialize = function(block, blockColumnView) {
	this.blockColumnView = blockColumnView;
	this.block = block;
	this.render();
};

BlockView.prototype.render = function() {
	if (this.element === undefined) {
		this.element = Canvas.rect(
			this.blockColumnView.x,
			this.blockColumnView.y + Math.round(this.block.relativeTopAge*this.blockColumnView.height),
			this.blockColumnView.width,
			this.blockColumnView.y + Math.round(this.block.relativeBaseAge*this.blockColumnView.height) - Math.round(this.block.relativeTopAge*this.blockColumnView.height)
		);
		this.element.attr({
			"fill": this.block.settings.backgroundColor
		});
	}
};

/*-----  End of BlockView  ------*/

