/**
 * TransectImage class extends the base model class 
*/
TransectImage = BaseModel.extend({
	
	_classname: "TransectImage",

	defaults: {
		x: 0,
		y: 0,
		width: null,
		height: null,
		imgUrl: null
	}
});

/*
Constructor for the image class
*/
TransectImage.prototype.initialize = function (attrs) {
	this.set({
		imgUrl: attrs.url,
		x: attrs.x,
		y: attrs.y,
		width: attrs.width,
		height: attrs.height
	});
};

TransectImage.prototype.validate = function(attrs, options) {
	if (width === null || height == null || url === null) {
		throw "Error: undefined attributes!";
	}
};
