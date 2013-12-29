/**
 * Converts the tsc color to css color.
 */
TscToCssColor = function(color) {
	rgb = color.split("/");
	return this.rgbToHex(rgb[0], rgb[1], rgb[2]);
};


/**
 * Converts R G B values to CSS color.
 */
RgbToHex = function(r, g, b) {
    return "#" + ((1 << 24) + (parseInt(r) << 16) + (parseInt(g) << 8) + parseInt(b)).toString(16).slice(1);
}

CssToTscColor = function(color) {
	var color = Raphael.getRGB(color);
	return (color.r + "/" + color.g + "/" + color.b);
}
