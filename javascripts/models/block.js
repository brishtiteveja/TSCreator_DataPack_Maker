/**
 * This is the model for block. Block is a datapoint in the block column.
 */

var Block = BaseModel.extend({
	classname: "Block",
	defaults: {
		topAge: null, 
		baseAge: null,
		relativeTopAge: null, // relativeTopAge is top age relative to the column. 
		relativeBaseAge: null, // similarly relativeBaseAge is base age relative to the column.
		name: null,
		description: null,
		settings: null, // settings store information about the style attributes of the block.
	}
});

Block.prototype.initialize = function(attrs) {
	if (attrs === undefined) return;
	// Add attributes such as bg color, font etc to settings.
	this.set({
		settings: new Settings({backgroundColor: attrs["backgroundColor"]})
	});
};
