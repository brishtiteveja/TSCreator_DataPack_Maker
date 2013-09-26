var BlockColumnView = ColumnView.extend({
	tagName: "rect",
	classname: "BlockColumnView",
});

BlockColumnView.prototype.initialize = function(blockCloumn, x, y) {
	this.x = x;
	this.y = y;
	this.column = blockCloumn;
	this.height = this.column.baseY() - this.column.topY();
	this.width = 100;
	this.render();
};

BlockColumnView.prototype.render = function() {
	if (this.element === undefined) {
		this.element = Canvas.rect(this.x,this.y, this.width, this.y + this.height);
	}
	if (this.blocks === undefined) {
		this.blocks = Canvas.set();
	}
	this.column.blocks.forEach(this.addBlock.bind(this));
};

BlockColumnView.prototype.addBlock = function(block) {
	var block = new BlockView(block, this);
};

