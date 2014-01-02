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
				width: null,
				height: null,
				origWidth: null,
				origHeight: null,
				angle: 0,
				preserveAspectRatio: true,
				data: "data" in attributes ? attributes.data: null
			}];
			BaseModel.apply(this, attrs);
		}
	});

	return TransectImage;
});

/*-----  End of TransectImage  ------*/

