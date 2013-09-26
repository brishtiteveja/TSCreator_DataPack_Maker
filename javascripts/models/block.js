var Block = BaseModel.extend({
	classname: "Block",
	defaults: {
		topAge: null,
		baseAge: null,
		relativeTopAge: null,
		relativeBaseAge: null,
		name: null,
		description: null,
		settings: null,
	}
});

Block.prototype.initialize = function(attrs) {
	if (attrs === undefined) return;
	
	this.set({
		settings: new Settings({backgroundColor: attrs["backgroundColor"]})
	});
};
