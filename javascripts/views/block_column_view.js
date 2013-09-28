/*========================================
=            BlockColumnView            =
========================================*/

var BlockColumnView = ColumnView.extend({
	el: "#blocks-list",
	classname: "BlockColumnView"
});

BlockColumnView.prototype.blocksTableTemplate = new EJS({url: '/html/templates/data_tbl.ejs'});

BlockColumnView.prototype.initialize = function(blockCloumn, x, y) {

	/* Necessary dom elements */
	this.$blockList = $(".blocks-list")[0];
	

	/* Set the column specific settings details */
	this.column = blockCloumn;
	this.x = x;
	this.y = y;
	this.height = this.column.baseY() - this.column.topY();
	this.width = 100;

	/* Listen to the following changes in model */
	this.listenTo(this.column, 'BlockColumn:blockAdded', this.render.bind(this));
	this.listenTo(this.column.blocks, 'change:name', this.render.bind(this));
	this.listenTo(this.column.blocks, 'change:topAge', this.render.bind(this));
	this.listenTo(this.column.blocks, 'change:baseAge', this.render.bind(this));
	this.listenTo(this.column.blocks, 'change:description', this.render.bind(this));

	/* Render the column details in the setting panel */
	this.render();
};

BlockColumnView.prototype.render = function() {
	this.$el.html(this.blocksTableTemplate.render({name: this.column.get('name')}));
	this.renderColumn();
};

BlockColumnView.prototype.renderColumn = function() {
	this.column.updateBlockAges();
	this.column.updateRelativeAges();
	this.height = this.column.baseY() - this.column.topY();
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
	this.$(".data-list").append(block.el);
};


/*-----  End of BlockColumnView  ------*/