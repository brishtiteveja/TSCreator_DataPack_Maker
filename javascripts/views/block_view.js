var BlockView = BaseView.extend({
	tagName: "rect",
	classname: "BlockView",
	block: null,
	x: 0,
	y: 0,
});

BlockView.prototype.initialize = function(block, blockColumn) {
	this.blockColumn = blockColumn;
	this.block = block;
	this.render();
};

BlockView.prototype.render = function() {
	if (this.element === undefined) {
		this.element = Canvas.rect(
			this.blockColumn.x,
			this.blockColumn.y + Math.round(this.block.get('relativeTopAge')*this.blockColumn.height),
			this.blockColumn.width,
			this.blockColumn.y + Math.round(this.block.get('relativeBaseAge')*this.blockColumn.height) - Math.round(this.block.get('relativeTopAge')*this.blockColumn.height)
		);
		var settings = this.block.get('settings');
		this.element.attr({
			"fill": settings.get('backgroundColor'),
			"font-family": settings.get('fontStyle'),
			"font-weight": settings.get('fontWeight'),
			"font-size": settings.get('fontSize')
		});
	}
};