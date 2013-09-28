/*===============================================================
=            Blocks is a collection of block models.            =
===============================================================*/

var Blocks = BaseCollection.extend({
	classname: "Blocks",
	model: Block
});

Blocks.prototype.comparator = function(block) {
	return block.baseAge;
};

/*-----  End of Blocks Collection  ------*/



/*=============================================================================================
=            BlockColumn is a nested collection that contains collection of blocks            =
=============================================================================================*/

var BlockColumn = Column.extend({
	classname: "BlockColumn",
	constructor: function (attributes, options) {
		this.name = "name" in attributes ? attributes.name : null;
		this.width = "width" in attributes ? attributes.width : null;
		this.settings = "backgroundColor" in attributes ? new Settings({backgroundColor: attributes.backgroundColor}) : new Settings;
		this.blocks = "blocks" in attributes ? new Blocks(attributes.blocks) : null;
		Column.apply(this, []);
	}
});


/**
*
* Initialize the blocks in the column with topAge and relative ages.
*
**/

BlockColumn.prototype.initialize = function() {
	this.updateBlocks();
	this.updateRelativeAges();
};

/**
 * Returns the topAge in terms of absolute pixel X-Coordinate
 */
 BlockColumn.prototype.topY = function() {
	var topAge = this.blocks.min(function(block){ return block.topAge;}).topAge;
	return Math.round(topAge*VERTICAL_SCALE);
};


/**
 * Returns the baseAge in terms of absolute pixel Y-Coordinate
 */
BlockColumn.prototype.baseY = function() {
	var baseAge = this.blocks.max(function(block){return block.baseAge;}).baseAge;
	return Math.round(baseAge*VERTICAL_SCALE);
};

/**
 * Updates all blocks top ages which are the base ages of the previous blocks in sorted order.
 */
BlockColumn.prototype.updateBlocks = function() {
	var self = this;
	this.blocks.each(function(block, index, blocks) {
		block.topAge = index > 0 ? blocks[index - 1].baseAge : block.baseAge;
	});
};

/**
 * Returns the top age of the block_column.
 */
BlockColumn.prototype.topAge = function() {
	return this.blocks.min(function(block){ return block.topAge;}).topAge;
};

/**
 * Returns the base age of the block column.
 */
BlockColumn.prototype.baseAge = function() {
	return this.blocks.max(function(block){ return block.baseAge;}).baseAge;
};

/**
 * Updates relative ages wrt to the block column top and base ages.
 */
BlockColumn.prototype.updateRelativeAges = function() {
	var self = this;
	var colTopAge = this.topAge();
	var colBaseAge = this.baseAge();
	this.blocks.each(function(block) {
		block.relativeTopAge = (block.topAge - colTopAge)/(colBaseAge - colTopAge);
		block.relativeBaseAge = (block.baseAge - colTopAge)/(colBaseAge - colTopAge);
	});
};

/*-----  End of BlockColumn  ------*/
