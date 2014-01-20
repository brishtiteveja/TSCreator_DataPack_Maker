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
				name: attributes.name || _.uniqueId("Block "),
				description: attributes.description,
				settings: new Settings(),
				top: attributes.top || null,
				base: attributes.base || null,
				blockColumn: attributes.blockColumn || null,
			}];

			BaseModel.apply(this, attrs);
		}
	});

	Block.prototype.initialize = function() {
		this.get('settings').set({
			'backgroundColor': "#FF0000"
		});
	}

	Block.prototype.toJSON = function() {
		var json = _.clone(this.attributes);
		delete json["blockColumn"];
		return json;
	}

	return Block;
});
/*-----  End of Block  ------*/

