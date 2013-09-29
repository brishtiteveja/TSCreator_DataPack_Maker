/*=============================================================================================
=            Settings is the model for storing any kind of style related settings.            =
=============================================================================================*/

var Settings = BaseModel.extend({
	classname: "Settings",

	/* Constructor for settings object */
	constructor: function(attributes, options) {
		if (attributes === undefined) return;
		var attrs = [{
			fontFamily: attributes.fontFamily || '"Times New Roman", Times, serif',
			fontVariant: attributes.fontVariant || "normal",
			fontWeight: attributes.fontWeight || "normal",
			fontStretch: attributes.fontStretch || "normal",
			fontSize: attributes.fontSize || "medium",
			backgroundColor: attributes.backgroundColor ? this.getCssColor(attributes.backgroundColor) : "#DDDDDD",
			foregroundColor: attributes.foregroundColor ? this.getCssColor(attributes.foregroundColor) : "#000000",
			strokeWidth: attributes.strokeWidth || 3,
			strokeColor: attributes.strokeColor || "#000000"
		}];
		BaseModel.apply(this, attrs);
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

