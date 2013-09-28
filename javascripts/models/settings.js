/*=============================================================================================
=            Settings is the model for storing any kind of style related settings.            =
=============================================================================================*/

var Settings = BaseModel.extend({
	classname: "Settings",

	/* Constructor for settings object */
	constructor: function(attributes, options) {
		if (attributes === undefined) return;
		this.fontFamily = attributes.fontFamily ? attributes.fontFamily : '"Times New Roman", Times, serif';
		this.fontVariant = attributes.fontVariant ? attributes.fontVariant : "normal";
		this.fontWeight = attributes.fontWeight ? attributes.fontWeight : "normal";
		this.fontStretch = attributes.fontStretch ? attributes.fontStretch : "normal";
		this.fontSize = attributes.fontSize ? attributes.fontSize : "medium";
		this.backgroundColor = attributes.backgroundColor ? this.getCssColor(attributes.backgroundColor) : "#DDDDDD";
		this.foregroundColor = attributes.foregroundColor ? this.getCssColor(attributes.foregroundColor) : "#000000";
		BaseModel.apply(this, []);
	}
});

/**
 * Converts the tsc color to css color.
 */
Settings.prototype.getCssColor = function(color) {
	rgb = color.split("/");
	return this.rgbToHex(rgb[0], rgb[1], rgb[2]);
};


/**
 * Converts R G B values to CSS color.
 */
Settings.prototype.rgbToHex = function(r, g, b) {
    return "#" + ((1 << 24) + (parseInt(r) << 16) + (parseInt(g) << 8) + parseInt(b)).toString(16).slice(1);
}

/*-----  End of Settings  ------*/

