/*======================================================================================
=            TransectImage is used for saving transect image related state.            =
======================================================================================*/

TransectImage = BaseModel.extend({	
	classname: "TransectImage",
	constructor: function(attributes, options) {
		var attrs = [{
			x: "x" in attributes ? attributes.x : 0,
			y: "y" in attributes ? attributes.y : 0,
			url: "url" in attributes ? attributes.url: null
		}];
		BaseModel.apply(this, attrs);
	}
});

TransectImage.prototype.initialize = function (attrs) {
	this.set({
		width: 796*1.5,
		height: 516*1.5
	});
};

/*-----  End of TransectImage  ------*/

