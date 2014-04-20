ViewboxToCanvas = function(app, x, y) {
	var vBox = app.Canvas.canvas.viewBox.baseVal;
	var width = app.Canvas.width;
	var height = app.Canvas.height;
	var relX = x / width;
	var relY = y / height;

	var canvasX = vBox.x + Math.round(relX * vBox.width);
	var canvasY = vBox.y + Math.round(relY * vBox.height);
	return {
		x: canvasX,
		y: canvasY
	};
}