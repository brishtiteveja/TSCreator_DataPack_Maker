/*================================
=            LineView            =
================================*/

var LineView = BaseView.extend({
	tagName: 'tr',
	classname: "LineView",
	events: {
		'click .toggle': 'toggleLineForm'
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

	this.$updateBtn.click(this.updateLine.bind(this));

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
	this.setFinishedMode();
};


LineView.prototype.removeElement = function() {
	this.remove();
	this.element.remove();
}

LineView.prototype.toggleLineForm = function() {
	this.line.set({
		'edit': !this.line.get('edit')
	});
}

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
}


LineView.prototype.setFinishedMode = function() {
	this.element.attr({
		'stroke-width': 2,
		'stroke': '#000000'
	});
};

LineView.prototype.setEditMode = function() {
	this.element.attr({
		'stroke-width': 2,
		'stroke': "#000000"
	});
}

LineView.prototype.updateLine = function() {
	var name = this.$lineName.value;
	var pattern = this.$linePattern.value;
	this.line.set({
		name: name,
		pattern: pattern
	});
}

/*-----  End of LineView  ------*/

