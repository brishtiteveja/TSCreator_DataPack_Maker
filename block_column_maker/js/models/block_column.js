/*=============================================================================================
=            BlockColumn is a nested collection that contains collection of blocks            =
=============================================================================================*/

define(["baseModel", "blocks", "settings"], function(BaseModel, Blocks, Settings) {
	var BlockColumn = BaseModel.extend({
		classname: "BlockColumn",		
		constructor: function (attributes) {	
			var attrs = [{
				x: "x" in attributes ? attributes.x: 0,
				name: "name" in attributes ? attributes.name : _.uniqueId("Column "),
				width: parseInt(attributes.width) || 200,
				description: attributes.description || null,
				blocks: new Blocks(),
				settings: new Settings(),
			}];
			BaseModel.apply(this, attrs);
		}
	});

	BlockColumn.prototype.comparator = function(blockColumn) {
		return blockColumn.get('x');
	}

	return BlockColumn;
});
/*-----  End of BlockColumn  ------*/
