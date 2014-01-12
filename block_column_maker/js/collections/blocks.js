/*===============================================================
=            Blocks is a collection of block models.            =
===============================================================*/

define(["baseCollection", "block"], function(BaseCollection, Block) {

	var Blocks = BaseCollection.extend({
		classname: "Blocks",
		model: Block
	});

	return Blocks;
});
/*-----  End of Blocks Collection  ------*/

