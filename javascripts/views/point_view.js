/*=================================
=            PointView            =
=================================*/

var PointView = BaseView.extend({
	classname: "PointView"
});

PointView.prototype.initialize = function(point) {
	this.point = point;
	this.render();
	this.listenTo(this.point, 'destroy', this.removeElement.bind(this));
	this.listenTo(this.point, 'change', this.updateElement.bind(this));
};

PointView.prototype.render = function() {
	this.renderPoint();
};

PointView.prototype.renderPoint = function() {
	if (this.element === undefined) {
		this.element = Canvas.circle(this.point.get('x'), this.point.get('y'), 4);
	}
	this.element.attr({
		'fill': "#000000"
	});
	PointsSet.push(this.element);
	this.element.hover(this.onMouseOver.bind(this), this.onMouseOut.bind(this));
	this.element.click(this.onClick.bind(this));
	this.element.drag(this.onDragMove.bind(this), this.onDragStart.bind(this), this.onDragEnd.bind(this));
};

PointView.prototype.updateElement = function() {
	this.element.attr({
		'cx': this.point.get('x'),
		'cy': this.point.get('y')
	});
}

PointView.prototype.onMouseOver = function() {
	this.element.attr({
		'r': 8,
		'fill': "#FF0033",
		'stroke': '#FF0033'
	});
};

PointView.prototype.onMouseOut = function() {
	this.element.attr({
		'r' : 4,
		'fill': "#000000",
		'stroke': "#000000"
	});
};

PointView.prototype.onClick = function() {
	CurrentPolygonView.addNewPoint(this.point);
}

PointView.prototype.removeElement = function() {
	this.element.remove();
}

PointView.prototype.onDragStart = function(x, y, evt) {
}

PointView.prototype.onDragMove = function(dx, dy, x, y, evt) {
	this.point.set({
		x: evt.offsetX,
		y: evt.offsetY
	});
}


PointView.prototype.onDragEnd = function(evt) {
}

/*-----  End of PointView  ------*/

