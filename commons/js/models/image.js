/*======================================================================================
=            ImageOb is used for saving transect image related state.            =
======================================================================================*/

define(["baseModel"], function(BaseModel) {
	var ImageOb = BaseModel.extend({	
		classname: "ImageOb",
		constructor: function(attributes, options) {
			var attrs = [{
				x                   : attributes && "x" in attributes ? attributes.x                       : 0,
				y                   : attributes && "y" in attributes ? attributes.y                       : 0,
				width               : attributes && "width" in attributes ? attributes.width                             : null,
				height              : attributes && "height" in attributes ? attributes.height                           : null,
				origWidth           : attributes && "origWidth" in attributes ? attributes.origWidth                     : null,
				origHeight          : attributes && "origHeight" in attributes ? attributes.origHeight                   : null,
				angle               : attributes && "angle" in attributes ? attributes.angle                             : 0,
				preserveAspectRatio : attributes && "preserveAspectRatio" in attributes ? attributes.preserveAspectRatio : true,
				visible             : attributes && "visible" in attributes ? attributes.visible                         : true,
				data                : attributes && "data" in attributes ? attributes.data                               : null
			}];
			BaseModel.apply(this, attrs);
		}
	});

	return ImageOb;
});

/*-----  End of ImageOb  ------*/

