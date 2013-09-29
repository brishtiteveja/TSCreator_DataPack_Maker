/*======================================================================================
=            TransectImage is used for saving transect image related state.            =
======================================================================================*/

TransectImage = BaseModel.extend({	
	classname: "TransectImage",
	constructor: function(attributes, options) {
		var attrs = [{
			x: "x" in attributes ? attributes.x : 0,
			y: "y" in attributes ? attributes.y : 0
		}];
		BaseMode.apply(this, attrs);
	}
});

TransectImage.prototype.initialize = function (attrs) {
};

/*-----  End of TransectImage  ------*/

