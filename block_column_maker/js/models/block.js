/*==============================================================================================
=            This is the model for block. Block is a datapoint in the block column.            =
==============================================================================================*/

define(["baseModel", "settings"], function(BaseModel, Settings) {
	
	var Block = BaseModel.extend({
		classname: "Block",
		constructor: function (attributes, options) {
			var attrs  = [{
				edit: false,
				y: parseInt(attributes.y),
				name: attributes.name || _.uniqueId("Block "),
				description: attributes.description,
				baseAge: null,
				relativeBaseY: null,
				settings: new Settings(),
				blockColumn: attributes.blockColumn || null,
			}];

			BaseModel.apply(this, attrs);
		}
	});

	Block.prototype.initialize = function() {
		this.update();
	}

	Block.prototype.update = function() {
	}

	return Block;
});
/*-----  End of Block  ------*/

