/*===============================================================
=            Blocks is a collection of block models.            =
===============================================================*/

define(["baseCollection", "block"], function(BaseCollection, Block) {

	var Blocks = BaseCollection.extend({
		classname: "Blocks",
		model: Block
	});


	Blocks.prototype.comparator = function(block) {
		return block.get('baseAge');
	};

	return Blocks;
});
/*-----  End of Blocks Collection  ------*/

