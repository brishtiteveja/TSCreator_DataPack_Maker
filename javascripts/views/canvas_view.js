/*====================================================
=            CanvasView is the basic view            =
====================================================*/

var CanvasView = BaseView.extend({
	el: ".container",
	classname: "CanvasView",
	events: {
		'click a[href*="blocks"]': "showBlockSettings",
		'click a[href*="defaults"]': "showDefaultSettings"
	}
})

CanvasView.prototype.initialize = function() {
	this.$canvas = $("#canvas");
	this.$blockSettings = $("#block-settings");
	this.$defaultSettings = $("#default-settings");

	Canvas = new Raphael(this.$canvas[0], "100%", 1000);
	this.render();
};

CanvasView.prototype.render = function() {
	this.renderMasterColumn();
};

CanvasView.prototype.renderMasterColumn = function() {
	MasterChronoStratColumn = new BlockColumn(MasterChronoStratigraphy);
	MasterChronoStratView = new BlockColumnView(MasterChronoStratColumn, 10, 10);
};

CanvasView.prototype.showBlockSettings = function(evt) {
	this.$blockSettings.addClass("active");
	this.$defaultSettings.removeClass("active");
};

CanvasView.prototype.showDefaultSettings = function(evt) {
	this.$blockSettings.removeClass("active");
	this.$defaultSettings.addClass("active");
};

/*-----  End of CanvasView  ------*/

