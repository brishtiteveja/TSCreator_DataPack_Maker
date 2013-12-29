/*======================================================================================
=            TransectImage is used for saving transect image related state.            =
======================================================================================*/

define(["baseModel"], function(BaseModel) {
	var TransectImage = BaseModel.extend({	
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
			width: 796*3,
			height: 516*3
		});
	};

	return TransectImage;
});

/*-----  End of TransectImage  ------*/

