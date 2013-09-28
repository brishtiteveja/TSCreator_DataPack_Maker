/*========================================
=            BlockColumnView            =
========================================*/

var BlockColumnView = ColumnView.extend({
	el: ".display",
	classname: "BlockColumnView",
	events: {
		'click a[href*="add-block"]': 'createBlock'
	}
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
	this.listenTo(this.column, 'BlockColumn:blockAdded', this.changeColumnBlocks);
};

BlockColumnView.prototype.render = function() {
	if (this.set === undefined) {
		this.set = Canvas.set();
	}

	if (this.element === undefined) {
		this.element = Canvas.rect();
		this.set.push(this.element);
	}

	this.element.attr({
		x: this.x,
		y: this.y,
		width: this.width,
		height: this.height
	});

	if (this.blocks === undefined) {
		this.blocks = Canvas.set();
	} else {
		this.blocks.remove();
		this.blocks = Canvas.set();
	}
	Canvas.setSize(Math.max(Canvas.width, this.width), Math.max(Canvas.height, this.height + 20));
	this.column.blocks.forEach(this.addBlock.bind(this));
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

BlockColumnView.prototype.changeColumnBlocks = function() {
	this.updateColumn();
};

BlockColumnView.prototype.updateColumn = function() {
	this.height = this.column.baseY() - this.column.topY();
	this.width = 100;
	this.render();
};

BlockColumnView.prototype.createBlock = function(evt) {
	var block = new Block({
		name: "New Column",
		baseAge: this.column.baseAge() + 10
	});
	this.column.addBlock(block);
};

/*-----  End of BlockColumnView  ------*/