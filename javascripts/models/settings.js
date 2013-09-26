var Settings = BaseModel.extend({
	classname: "Settings",

	defaults: {
		fontStyle: "normal",
		fontVariant: "normal",
		fontWeight: "normal",
		fontStretch: "normal",
		fontSize: "medium",
		lineHeight: "normal",
		fontFamily:'"Times New Roman", Times, serif',
		backgroundColor: "#DDDDDD",
		foregroundColor: "#000000"
	}
});

Settings.prototype.initialize = function(attrs) {
	var self  = this;
	if (attrs.backgroundColor !== null) {
		this.set({
			backgroundColor: self.getCssColor(this.get('backgroundColor'))
		});	
	} else {
		this.set({
			backgroundColor: "#DDDDDD"
		});
	}
};

Settings.prototype.getCssColor = function(color) {
	rgb = color.split("/");
	return this.rgbToHex(rgb[0], rgb[1], rgb[2]);
};

Settings.prototype.rgbToHex = function(r, g, b) {
    return "#" + ((1 << 24) + (parseInt(r) << 16) + (parseInt(g) << 8) + parseInt(b)).toString(16).slice(1);
}