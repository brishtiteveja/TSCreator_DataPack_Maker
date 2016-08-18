ViewboxToPaper = function(app, x, y) {
	var vBox = app.Paper.canvas.viewBox.baseVal;
	var width = app.Paper.width;
	var height = app.Paper.height;

	var rect = app.BgRect;
	if (rect != null) {
		var rectWidth = rect.attr("width");
		var rectHeight = rect.attr("height");
		if (width != rectWidth)
			width = rectWidth;
		if (height != rectHeight)
			height = rectHeight;
	}

	var relX = x / width;
	var relY = y / height;

	var canvasX = vBox.x + Math.round(relX * vBox.width);
	var canvasY = vBox.y + Math.round(relY * vBox.height);
	return {
		x: canvasX,
		y: canvasY
	};
}
