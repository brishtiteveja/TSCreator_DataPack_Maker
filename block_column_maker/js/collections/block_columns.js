/*================================================
=            Block Columns collection            =
================================================*/

define(["baseCollection", "blockColumn"], function(BaseCollection, BlockColumn) {

	var BlockColumns = BaseCollection.extend({
		classname: "BlockColumns",
		model: BlockColumn,
	});

	return BlockColumns;
});

/*-----  End of Block Columns collection  ------*/

