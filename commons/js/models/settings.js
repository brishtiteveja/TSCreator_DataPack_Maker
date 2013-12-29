/*=============================================================================================
=            Settings is the model for storing any kind of style related settings.            =
=============================================================================================*/

var Settings = BaseModel.extend({
	classname: "Settings",

	/* Constructor for settings object */
	constructor: function(attributes, options) {
		var attrs = [{
			fontFamily: attributes ? attributes.fontFamily : '"Times New Roman", Times, serif',
			fontVariant: attributes ? attributes.fontVariant : "normal",
			fontWeight: attributes ? attributes.fontWeight : "normal",
			fontStretch: attributes ? attributes.fontStretch : "normal",
			fontSize: attributes ? attributes.fontSize : "medium",
			backgroundColor: attributes && attributes.backgroundColor ? TscToCssColor(attributes.backgroundColor) : "#DDDDDD",
			foregroundColor: attributes && attributes.foregroundColor ? TscToCssColor(attributes.foregroundColor) : "#000000",
			strokeWidth: attributes ? attributes.strokeWidth : 3,
			strokeColor: attributes ? attributes.strokeColor : "#000000"
		}];
		BaseModel.apply(this, attrs);
	}
});


/*-----  End of Settings  ------*/

