/*==============================================================================================
=            This is the model for block. Block is a datapoint in the block column.            =
==============================================================================================*/

define(["baseModel", "settings"], function(BaseModel, Settings) {
	
	var Block = BaseModel.extend({
		classname: "Block",
		constructor: function (attributes, options) {
			var attrs  = [{
				edit: false,
				hover: false,
				y: parseInt(attributes.y),
				name: attributes.name || _.uniqueId("Block "),
				description: attributes.description,
				baseAge: null,
				relativeBaseY: null,
				settings: new Settings(),
				topBlock: null,
				blockColumn: attributes.blockColumn || null,
			}];

			BaseModel.apply(this, attrs);
		}
	});

	Block.prototype.initialize = function() {
	}

	Block.prototype.update = function() {
		this.set({
			topBlock: this.getTopBlock()
		});
	}

	Block.prototype.getTopBlock = function() {
		var blocks = this.get('blockColumn').get('blocks');
		blocks.sort();
		var index = blocks.indexOf(this);
		if (index > 0) {
			return blocks.at(index - 1);	
		} else {
			return null;
		}
	}

	Block.prototype.toJSON = function() {
		var json = _.clone(this.attributes);
		delete json["blockColumn"];
		delete json["topBlock"];
		return json;
	}

	return Block;
});
/*-----  End of Block  ------*/

