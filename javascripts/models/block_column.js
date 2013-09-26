var BlockColumn = Column.extend({
	classname: "BlockColumn",
	model: Block,
	blocks: []
});

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

BlockColumn.prototype.addBlocks = function(data) {
	data.forEach(this.addBlock.bind(this));
};

BlockColumn.prototype.addBlock = function(data) {
	var block = new Block(data);
	this.blocks.push(block);
};

BlockColumn.prototype.topY = function() {
	var topAge = _.max(this.blocks, function(block){ return block.get("topAge");}).get('topAge')
	// return Math.round(topAge*VERTICAL_SCALE);
	return 0;
};

BlockColumn.prototype.baseY = function() {
	var baseAge = _.max(this.blocks, function(block){ return block.get("baseAge");}).get('baseAge')
	return Math.round(baseAge*VERTICAL_SCALE);
};

BlockColumn.prototype.updateBlocks = function() {
	var self = this;
	this.blocks = _.sortBy(this.blocks, function(block){ return parseFloat(block.baseAge); });
	this.blocks.forEach(function(block, index, blocks) {
		self.blocks[index].set('topAge', index > 0 ? blocks[index - 1].get('baseAge') : block.get('baseAge'));
	});
};

BlockColumn.prototype.topAge = function() {
	return _.min(this.blocks, function(block){ return block.get("topAge");}).get('topAge');
};

BlockColumn.prototype.baseAge = function() {
	return _.max(this.blocks, function(block){ return block.get("baseAge");}).get('baseAge');
};

BlockColumn.prototype.updateRelativeAges = function() {
	var self = this;
	var colTopAge = this.topAge();
	var colBaseAge = this.baseAge();
	this.blocks.forEach(function(block, index, blocks) {
		self.blocks[index].set('relativeTopAge', (block.get('topAge') - colTopAge)/(colBaseAge - colTopAge));
		self.blocks[index].set('relativeBaseAge', (block.get('baseAge') - colTopAge)/(colBaseAge - colTopAge));
	});
};