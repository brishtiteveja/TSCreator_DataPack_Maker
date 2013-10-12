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

LineView.prototype.template = new EJS({url: '/html/templates/line.ejs'});

LineView.prototype.initialize = function(line) {
	this.line = line;
	this.render();
	this.listenTo(this.line, 'destroy', this.removeElement.bind(this));
	this.listenTo(this.line, 'change:edit', this.toggleEditStatus.bind(this));
};


LineView.prototype.render = function() {
	this.$el.html(this.template.render(this.line.toJSON()));

	this.$lineForm = this.$(".line-form");
	this.$lineData = this.$(".line-data");
	this.$lineName = this.$('input[name="line-name"]')[0];
	this.$linePattern = this.$('input[name="line-pattern"]')[0];

	this.renderLine();
};

LineView.prototype.renderLine = function() {
	this.element = Canvas.path();
	this.element.attr({
		'path': this.getPath()
	});
	this.setFinishedMode();
};


LineView.prototype.getPath = function() {
	return this.getStraightPath();
	// switch (this.line.get('pattern')) {
	// 	case 0:
	// 		return this.getStraightPath();
	// 		break;
	// 	case 1:
	// 		return this.getWavyPath();
	// 		break;
	// }
};

LineView.prototype.getStraightPath = function() {
	var path = "M" + this.line.point1.get('x') + "," + this.line.point1.get('y');
	path += ",L" + this.line.point2.get('x') + "," + this.line.point2.get('y');
	return path;
};

LineView.prototype.getJaggedPath = function() {
	var steps = Math.round(Math.abs(this.line.point1.get('y') - this.line.point2.get('y')) / 10);
	var xs = numeric.linspace(this.line.point1.get('x'), this.line.point2.get('x'), steps);
	var ys = numeric.linspace(this.line.point1.get('y'), this.line.point2.get('y'), steps);
	var path = "M";
	for (var i = 0; i < xs.length; i++) {
		if (i == 0) {
			path += xs[i] + "," + ys[i];
		} else {
			path += ',L' + (xs[i-1] + 10) + ',' + ys[i - 1];
			path += ',L' + (xs[i] - 10) + ',' + ys[i];
			if (i < xs.length - 1) {
				path += ',L' + (xs[i] + 10) + ',' + ys[i];	
			} else {
				path += ',L' + xs[i] + "," + ys[i];
			}
		}
		
	}
	return path;
};

LineView.prototype.getWavyPath = function() {
	var steps = Math.round(Math.abs(this.line.point1.get('x') - this.line.point2.get('x')) / 5);
	var xs = numeric.linspace(this.line.point1.get('x'), this.line.point2.get('x'), steps);
	var ys = numeric.linspace(this.line.point1.get('y'), this.line.point2.get('y'), steps);
	var path = "M" + xs[0] + "," + ys[0];
	for (var i = 0; i < ys.length; i+=2) {
		if (i%4 == 0) {
			path += ',S' + xs[i - 1] + ',' + (ys[i - 1] + 5);
		} else {
			path += ',S' + xs[i - 1] + ',' + (ys[i - 1] - 5);
		}
		path += ',' + xs[i] + ',' + ys[i];	
	}
	return path;
};

// 010201020

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

/*-----  End of LineView  ------*/

