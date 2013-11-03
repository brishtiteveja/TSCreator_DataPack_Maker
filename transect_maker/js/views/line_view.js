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
	this.render();
	this.listenTo(this.line, 'destroy', this.removeElement.bind(this));
	this.listenTo(this.line, 'change:edit', this.toggleEditStatus.bind(this));
	this.listenTo(this.line, 'change:name', this.render.bind(this));
	this.listenTo(this.line, 'change:pattern', this.render.bind(this));
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
	this.element.attr({
		'path': this.getPath()
	});
	this.setFinishedMode();
};


LineView.prototype.getPath = function() {
	switch (this.line.get('pattern')) {
		case "default":
			return this.getStraightPath();
			break;
		case "jagged":
			return this.getJaggedPath();;
			break;
		case "wavy":
			return this.getJaggedPath();;
			break;
	}
};

LineView.prototype.getStraightPath = function() {
	var path = "M" + this.line.get("point1").get('x') + "," + this.line.get("point1").get('y');
	path += ",L" + this.line.get("point2").get('x') + "," + this.line.get("point2").get('y');
	return path;
};

LineView.prototype.getJaggedPath = function() {
	var slopeNumerator = (this.line.get("point1").get('y') - this.line.get("point2").get('y'));
	var slopeDenominator = (this.line.get("point1").get('x') - this.line.get("point2").get('x'));
	var slope = slopeNumerator/slopeDenominator;
	var steps = Math.round(Math.abs(this.line.get("point1").get('y') - this.line.get("point2").get('y')) / 10);
	var xs = numeric.linspace(this.line.get("point1").get('x'), this.line.get("point2").get('x'), steps);
	var ys = numeric.linspace(this.line.get("point1").get('y'), this.line.get("point2").get('y'), steps);
	var path = "";
	
	if (xs.length == 0) {
		return this.getStraightPath();
	}

	for (var i = 0; i < xs.length; i++) {
		if (i == 0) {
			path += "M" + xs[i] + "," + ys[i];
		} else {
			if ((slopeNumerator > 0 && slope > 0) || (slopeNumerator < 0 && slope < 0)) {
				path += ',L' + (xs[i-1] + 10) + ',' + ys[i - 1];
				path += ',L' + (xs[i] - 10) + ',' + ys[i];
				if (i < xs.length - 1) {
					path += ',L' + (xs[i] + 10) + ',' + ys[i];	
				} else {
					path += ',L' + xs[i] + "," + ys[i];
				}
			} else {	
				path += ',L' + (xs[i-1] - 10) + ',' + ys[i - 1];
				path += ',L' + (xs[i] + 10) + ',' + ys[i];
				if (i < xs.length - 1) {
					path += ',L' + (xs[i] - 10) + ',' + ys[i];	
				} else {
					path += ',L' + xs[i] + "," + ys[i];
				}
			}
		}
	}
	return path;
};

LineView.prototype.getWavyPath = function() {
	/**
	
		TODO:
		- Maker wavy line
		- Second todo item
	
	**/
	this.getStraightPath();
};

LineView.prototype.lineEq = function(x) {
	var slopeNumerator = (this.line.get("point1").get('y') - this.line.get("point2").get('y'));
	var slopeDenominator = (this.line.get("point1").get('x') - this.line.get("point2").get('x'));
	var slope = slopeNumerator/slopeDenominator;
	return (slope*x + get("point1").get('y'));
};

LineView.prototype.perpLineEq = function(x, x1, y1) {
	var slopeNumerator = (this.line.get("point1").get('y') - this.line.get("point2").get('y'));
	var slopeDenominator = (this.line.get("point1").get('x') - this.line.get("point2").get('x'));
	var slope = slopeNumerator/slopeDenominator;
	return ((x - x1)/slope + y1);
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

LineView.prototype.updateLine = function() {
	var name = this.$lineName.value;
	var pattern = this.$linePattern.value;
	this.line.set({
		name: name,
		pattern: pattern
	});
}

/*-----  End of LineView  ------*/

