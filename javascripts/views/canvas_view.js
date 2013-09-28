/*====================================================
=            CanvasView is the basic view            =
====================================================*/

var CanvasView = BaseView.extend({
	el: "#canvas",
	classname: "CanvasView"
})

CanvasView.prototype.initialize = function() {
	Canvas = new Raphael(this.$el[0], "100%", "100%");
	this.render();
};

CanvasView.prototype.render = function() {
	this.renderMasterColumn();
};

CanvasView.prototype.renderMasterColumn = function() {
	MasterChronoStratColumn = new BlockColumn(MasterChronoStratigraphy);
	MasterChronoStratView = new BlockColumnView(MasterChronoStratColumn, 10, 10);
};

/*-----  End of CanvasView  ------*/

