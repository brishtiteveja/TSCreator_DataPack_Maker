/*==============================================================================================
=            This is the model for block. Block is a datapoint in the block column.            =
==============================================================================================*/

var Block = BaseModel.extend({
	classname: "Block",
	constructor: function (attributes, options) {
		this.edit = false;
		this.name = attributes.name;
		this.topAge = attributes.topAge === undefined ? null : parseFloat(attributes.topAge);
		this.baseAge = attributes.baseAge === undefined ? null : parseFloat(attributes.baseAge);
		this.relativeTopAge = attributes.relativeTopAge === undefined ? null : parseFloat(attributes.relativeTopAge);
		this.relativeBaseAge = attributes.relativeBaseAge === undefined ? null : parseFloat(attributes.relativeBaseAge);
		this.description = attributes.description;
		this.settings = new Settings({backgroundColor: attributes.backgroundColor});
		BaseModel.apply(this, []);
	}
});

/*-----  End of Block  ------*/

