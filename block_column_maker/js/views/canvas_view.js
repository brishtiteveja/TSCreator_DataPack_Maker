/*====================================================
=            PaperView is the basic view            =
====================================================*/

var PaperView = BaseView.extend({
	el: ".container",
	classname: "PaperView",
	events: {
		'click a[href*="blocks"]': "showBlockSettings",
		'click a[href*="defaults"]': "showDefaultSettings",
		'click a[href*="add-block"]': 'createBlock'
	}
});

PaperView.prototype.initialize = function() {
	this.$canvas = this.$("#canvas");
	this.$blockSettings = $("#block-settings");
	this.$defaultSettings = $("#default-settings");

	Paper = new Raphael(this.$canvas[0], 1000, 1000);
	this.render();
};

PaperView.prototype.render = function() {
	this.renderMasterColumn();
};

PaperView.prototype.renderMasterColumn = function() {
	MasterChronoStratColumn = new BlockColumn(MasterChronoStratigraphy, 10, 10);
	MasterChronoStratView = new BlockColumnView(MasterChronoStratColumn);
};

PaperView.prototype.showBlockSettings = function(evt) {
	this.$blockSettings.addClass("active");
	this.$defaultSettings.removeClass("active");
};

PaperView.prototype.showDefaultSettings = function(evt) {
	this.$blockSettings.removeClass("active");
	this.$defaultSettings.addClass("active");
};

PaperView.prototype.createBlock = function(evt) {
	var block = new Block({
		name: "New Column",
		baseAge: MasterChronoStratColumn.baseAge() + 10
	});
	MasterChronoStratColumn.addBlock(block);
};

/*-----  End of PaperView  ------*/

