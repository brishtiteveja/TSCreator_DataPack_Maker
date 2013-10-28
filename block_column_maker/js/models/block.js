/*==============================================================================================
=            This is the model for block. Block is a datapoint in the block column.            =
==============================================================================================*/

var Block = BaseModel.extend({
	classname: "Block",
	constructor: function (attributes, options) {
		var attrs  = [{
			edit: false,
			name: attributes.name,
			topAge: attributes.topAge === undefined ? null : parseFloat(attributes.topAge),
			baseAge: attributes.baseAge === undefined ? null : parseFloat(attributes.baseAge),
			relativeTopAge: attributes.relativeTopAge === undefined ? null : parseFloat(attributes.relativeTopAge),
			relativeBaseAge: attributes.relativeBaseAge === undefined ? null : parseFloat(attributes.relativeBaseAge),
			description: attributes.description
		}];
		this.settings = new Settings({backgroundColor: attributes.backgroundColor});
		BaseModel.apply(this, attrs);
	}
});

/*-----  End of Block  ------*/

