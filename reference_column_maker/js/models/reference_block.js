/*==============================================================================================
=            This is the model for block. ReferenceBlock is a datapoint in the block column.            =
==============================================================================================*/

define(["baseModel", "settings"], function(BaseModel, Settings) {
	
	var ReferenceBlock = BaseModel.extend({
		classname: "ReferenceBlock",
		constructor: function (attributes, options) {
			var attrs  = [{
				edit        : false,
				hover       : false,
				name        : attributes.name || _.uniqueId("ReferenceBlock "),
				description : attributes.description,
				settings    : new Settings(),
				top         : attributes.top || null,
				base        : attributes.base || null,
				blockColumn : attributes.blockColumn || null,
			}];

			BaseModel.apply(this, attrs);
		}
	});

	ReferenceBlock.prototype.initialize = function() {
		this.get('settings').set({
			'backgroundColor': "#FF0000"
		});
	}

	ReferenceBlock.prototype.toJSON = function() {
		var json = _.clone(this.attributes);
		delete json["blockColumn"];
		return json;
	}

	return ReferenceBlock;
});
/*-----  End of ReferenceBlock  ------*/

