/**
 * Block column is a collection of blocks but it is also a model 
 */

var BlockColumn = Column.extend({
	classname: "BlockColumn",
	blocks: []
});

/**
 * This is the initialization step after the block column object is created.
 */
BlockColumn.prototype.initialize = function(data) {
	if ("name" in data){
		this.set({width: data["name"]});
	}
	if ("width" in data){
		this.set({width: data["width"]});
	}
	if ("backgroundColor" in data){
		this.set({width: data["backgroundColor"]});
	}
	if ("blocks" in data){
		this.addBlocks(data["blocks"]);
		this.updateBlocks();
	}
	this.updateRelativeAges();
};

/**
 * This function adds blocks to the the blocks array.
 */
BlockColumn.prototype.addBlocks = function(data) {
	data.forEach(this.addBlock.bind(this));
};


/**
 *
 */
BlockColumn.prototype.addBlock = function(data) {
	var block = new Block(data);
	this.blocks.push(block);
};



/**
 * Returns the topAge in terms of absolute pixel X-Coordinate
 */
 BlockColumn.prototype.topY = function() {
	var topAge = _.max(this.blocks, function(block){ return block.get("topAge");}).get('topAge')
	// return Math.round(topAge*VERTICAL_SCALE);
	return 0;
};


/**
 * Returns the baseAge in terms of absolute pixel Y-Coordinate
 */
BlockColumn.prototype.baseY = function() {
	var baseAge = _.max(this.blocks, function(block){ return block.get("baseAge");}).get('baseAge')
	return Math.round(baseAge*VERTICAL_SCALE);
};

/**
 * Updates all blocks top ages which are the base ages of the previous blocks in sorted order.
 */
BlockColumn.prototype.updateBlocks = function() {
	var self = this;
	this.blocks = _.sortBy(this.blocks, function(block){ return parseFloat(block.baseAge); });
	this.blocks.forEach(function(block, index, blocks) {
		self.blocks[index].set('topAge', index > 0 ? blocks[index - 1].get('baseAge') : block.get('baseAge'));
	});
};

/**
 * Returns the top age of the block_column.
 */
BlockColumn.prototype.topAge = function() {
	return _.min(this.blocks, function(block){ return block.get("topAge");}).get('topAge');
};

/**
 * Returns the base age of the block column.
 */
BlockColumn.prototype.baseAge = function() {
	return _.max(this.blocks, function(block){ return block.get("baseAge");}).get('baseAge');
};

/**
 * Updates relative ages wrt to the block column top and base ages.
 */
BlockColumn.prototype.updateRelativeAges = function() {
	var self = this;
	var colTopAge = this.topAge();
	var colBaseAge = this.baseAge();
	this.blocks.forEach(function(block, index, blocks) {
		self.blocks[index].set('relativeTopAge', (block.get('topAge') - colTopAge)/(colBaseAge - colTopAge));
		self.blocks[index].set('relativeBaseAge', (block.get('baseAge') - colTopAge)/(colBaseAge - colTopAge));
	});
};