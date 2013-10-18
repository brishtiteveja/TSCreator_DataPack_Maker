/*=================================
=            PointView            =
=================================*/

var PointView = BaseView.extend({
	tagName: 'tr',
	classname: "PointView",
	events: {
		'click .toggle': 'togglePointForm'
	}
});

PointView.prototype.template = new EJS({url: '/html/templates/point.ejs'});

PointView.prototype.initialize = function(point) {
	this.point = point;
	this.render();
	this.listenTo(this.point, 'destroy', this.removeElement.bind(this));
	this.listenTo(this.point, 'change:edit', this.toggleEditStatus.bind(this));
	this.listenTo(this.point, 'change:x', this.updateElement.bind(this));
	this.listenTo(this.point, 'change:y', this.updateElement.bind(this));
};

PointView.prototype.render = function() {
	this.$el.html(this.template.render(this.point.toJSON()));

	this.$toggle = this.$(".toggle"),
	this.$pointForm = this.$(".point-form");
	this.$pointData = this.$(".point-data");
	this.$pointName = this.$('input[name="point-name"]')[0];
	this.$pointAge = this.$('input[name="point-age"]')[0];

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
	this.setEditMode();
};

PointView.prototype.setFinishedMode = function() {
	this.element.attr({
		'r' : 4,
		'fill': "#000000",
		'stroke': "#000000"
	});
};

PointView.prototype.onMouseOut = function() {
	this.setFinishedMode();
};

PointView.prototype.setEditMode = function() {
	this.element.attr({
		'r': 8,
		'fill': "#FF0033",
		'stroke': '#FF0033'
	});
}

PointView.prototype.onClick = function() {
	CurrentPolygon.points.add(this.point);
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

PointView.prototype.togglePointForm = function(){
	this.point.set({
		'edit' : !this.point.get('edit')
	});
}

PointView.prototype.toggleEditStatus = function() {
	if (this.point.get('edit')) {
		this.$pointForm.removeClass('hide');
		this.$pointData.addClass('hide');
		this.$toggle.removeClass('hide-data');
		this.$toggle.addClass('show-data');
		this.setEditMode();
	} else {
		this.$pointForm.addClass('hide');
		this.$pointData.removeClass('hide');
		this.$toggle.removeClass('show-data');
		this.$toggle.addClass('hide-data');
		this.setFinishedMode();
	}
}

/*-----  End of PointView  ------*/

