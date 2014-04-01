/*=============================================================================================
=            Settings is the model for storing any kind of style related settings.            =
=============================================================================================*/

define(["baseModel"], function(BaseModel) {
	var Settings = BaseModel.extend({
		classname: "Settings",

		/* Constructor for settings object */
		constructor: function(attributes, options) {
			var attrs = [{
				fontFamily      : attributes ? attributes.fontFamily       : 'Arial, Helvetica, sans-serif',
				fontVariant     : attributes ? attributes.fontVariant      : "normal",
				fontWeight      : attributes ? attributes.fontWeight       : "normal",
				fontStretch     : attributes ? attributes.fontStretch      : "normal",
				fontSize        : attributes ? attributes.fontSize         : 12,
				backgroundColor : attributes && attributes.backgroundColor ? attributes.backgroundColor : "#DDDDDD",
				strokeWidth     : attributes ? attributes.strokeWidth      : 3,
				strokeColor     : attributes ? attributes.strokeColor      : "#000000"
			}];
			BaseModel.apply(this, attrs);
		}
	});

	return Settings;
});

/*-----  End of Settings  ------*/

