/*================================
=            LineView            =
================================*/

var LineView = BaseView.extend({
	tagName: 'li',
	classname: "LineView",
	events: {
		'click .toggle': 'toggleLineForm',
		'click .line-data': 'toggleLineForm',
		'keypress :input': 'updateLine',
		'keyup :input': 'updateLine',
		'mouseover': "onMouseOver",
		'mouseout': "onMouseOut",
	}
});


LineView.prototype.template = new EJS({url: '/transect_maker/ejs/line.ejs'});


LineView.prototype.initialize = function(line) {
	this.line = line;
	this.listenTo(this.line, 'destroy', this.removeElement.bind(this));
	this.listenTo(this.line, 'change:edit', this.toggleEditStatus.bind(this));
	this.listenTo(this.line, 'change:name', this.render.bind(this));
	this.listenTo(this.line.get('point1'), 'change', this.render.bind(this));
	this.listenTo(this.line.get('point2'), 'change', this.render.bind(this));
	this.listenTo(this.line, 'change:pattern', this.render.bind(this));
	this.render();
};


LineView.prototype.render = function() {
	this.$el.html(this.template.render(this.line.toJSON()));

	this.$toggle = this.$(".toggle");
	this.$lineForm = this.$(".line-form");
	this.$lineData = this.$(".line-data");
	this.$lineName = this.$('input[name="line-name"]')[0];
	this.$linePattern = this.$(".line-pattern")[0];
	this.$updateBtn = this.$('.update-line');

	this.renderLine();
};

/* creates a raphael pathe element for the line */

LineView.prototype.renderLine = function() {
	if (this.element === undefined) {
		this.element = transectApp.Canvas.path();	
	}
	var path = "M" + this.line.get("point1").get('x') + "," + this.line.get("point1").get('y');
	path += this.line.getPath();
	this.element.attr({
		'path': path
	});
	this.element.hover(this.onMouseOver.bind(this), this.onMouseOut.bind(this));
	this.setFinishedMode();
	this.renderTooltip();
};

LineView.prototype.renderTooltip = function() {
	var content = this.line.get('name');
	$(this.element.node).qtip({
		content: {
			text: content
		},
		position: {
			my: 'bottom left', // Position my top left...
			target: 'mouse', // my target 
		}
	});
}

LineView.prototype.onMouseOut = function() {
	this.setFinishedMode();
};

LineView.prototype.onMouseOver = function() {
	this.setEditMode();
};


LineView.prototype.removeElement = function() {
	this.remove();
	this.element.remove();
};

LineView.prototype.toggleLineForm = function() {
	this.render();
	this.line.set({
		'edit': !this.line.get('edit')
	});
};

LineView.prototype.toggleEditStatus = function() {
	if (this.line.get('edit')) {
		this.$lineForm.removeClass('hide');
		this.$lineData.addClass('hide');
		this.$toggle.removeClass('hide-data');
		this.$toggle.addClass('show-data');
	} else {
		this.$lineForm.addClass('hide');
		this.$lineData.removeClass('hide');
		this.$toggle.removeClass('show-data');
		this.$toggle.addClass('hide-data');
	}
};

LineView.prototype.setFinishedMode = function() {
	this.element.attr({
		'stroke-width': 2,
		'stroke': transectApp.lineMouseOut
	});
	this.$el.removeClass('hover');
};

LineView.prototype.setEditMode = function() {
	this.element.attr({
		'stroke-width': 6,
		'stroke': transectApp.lineMouseOver
	});
	this.$el.addClass('hover');
};

LineView.prototype.updateLine = function(evt) {

	if (evt.keyCode == 13) {
		this.toggleLineForm();
	}

	var name = this.$lineName.value;
	var pattern = this.$linePattern.value;
	this.line.set({
		name: name,
		pattern: pattern
	});
};

/*-----  End of LineView  ------*/
