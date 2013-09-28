/*========================================
=            BlockColumnView            =
========================================*/

var BlockColumnView = ColumnView.extend({
	el: "#canvas",
	classname: "BlockColumnView"
});

BlockColumnView.prototype.initialize = function(blockCloumn, x, y) {
	this.x = x;
	this.y = y;
	this.column = blockCloumn;
	this.height = this.column.baseY() - this.column.topY();
	this.width = 100;
	this.render();
	this.listenTo(this.column, 'change:x', this.changeColumnX);
	this.listenTo(this.column, 'change:y', this.changeColumnY);
	this.listenTo(this.column, 'change:width', this.changeColumnWidth);
	this.listenTo(this.column, 'change:height', this.changeColumnHeight);
	this.listenTo(this.column, 'change:blocks', this.changeColumnBlocks);
};

BlockColumnView.prototype.render = function() {
	if (this.element === undefined) {
		this.element = Canvas.rect();
	}
	this.element.attr({
		x: this.x,
		y: this.y,
		width: this.width,
		height: this.height
	});

	if (this.blocks === undefined) {
		this.blocks = Canvas.set();
		this.column.blocks.forEach(this.addBlock.bind(this));
	}
};

BlockColumnView.prototype.addBlock = function(block) {
	var block = new BlockView(block, this);
};

BlockColumnView.prototype.changeColumnX = function() {
};

BlockColumnView.prototype.changeColumnY = function() {
};

BlockColumnView.prototype.changeColumnWidth = function() {
};

BlockColumnView.prototype.changeColumnHeight = function() {
};

BlockColumnView.prototype.changeColumnBlocks = function(first_argument) {
};

/*-----  End of BlockColumnView  ------*/