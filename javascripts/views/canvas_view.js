var CanvasView = BaseView.extend({
	el: "#canvas",
})

CanvasView.prototype.initialize = function() {
	Canvas = new Raphael(this.$el[0], "100%", "100%");
	this.render();
};

CanvasView.prototype.render = function() {
	// MasterChronoStratColumn = new BlockColumn(MasterChronoStratigraphy);
	// MasterChronoStratView = new BlockColumnView(MasterChronoStratColumn, 10, 10);
};
