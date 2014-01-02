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
				width: "width" in attributes ? attributes.width : null,
				height: "height" in attributes ? attributes.height : null,
				origWidth: "origWidth" in attributes ? attributes.origWidth : null,
				origHeight: "origHeight" in attributes ? attributes.origHeight : null,
				angle: "angle" in attributes ? attributes.angle : 0,
				preserveAspectRatio: "preserveAspectRatio" in attributes ? attributes.preserveAspectRatio : true,
				data: "data" in attributes ? attributes.data : null
			}];
			BaseModel.apply(this, attrs);
		}
	});

	return TransectImage;
});

/*-----  End of TransectImage  ------*/

