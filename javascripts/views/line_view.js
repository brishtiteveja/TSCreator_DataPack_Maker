/*================================
=            LineView            =
================================*/

var LineView = BaseView.extend({
	classname: "LineView"
});

LineView.prototype.initialize = function(line) {
	this.line = line;
	this.render();
	this.listenTo(this.line, 'destroy', this.removeElement.bind(this));
};

LineView.prototype.render = function() {
	this.renderLine();
};

LineView.prototype.renderLine = function() {
	this.element = Canvas.path();
	this.element.attr({
		"stroke-width": 2
	});
	this.element.attr({
		'path': this.getPath()
	});
};

LineView.prototype.getPath = function() {
	var path = "M" + this.line.point1.get('x') + "," + this.line.point1.get('y');
	path += ",L" + this.line.point2.get('x') + "," + this.line.point2.get('y');
	return path;
};

LineView.prototype.removeElement = function() {
	this.element.remove();
}

/*-----  End of LineView  ------*/

