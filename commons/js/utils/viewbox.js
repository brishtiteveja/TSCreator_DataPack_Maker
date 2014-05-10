ViewboxToPaper = function(app, x, y) {
	var vBox = app.Paper.canvas.viewBox.baseVal;
	var width = app.Paper.width;
	var height = app.Paper.height;
	var relX = x / width;
	var relY = y / height;

	var canvasX = vBox.x + Math.round(relX * vBox.width);
	var canvasY = vBox.y + Math.round(relY * vBox.height);
	return {
		x: canvasX,
		y: canvasY
	};
}
