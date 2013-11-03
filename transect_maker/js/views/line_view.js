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
	debugger;
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
			return this.getWavyPath();;
			break;
		case "lapping":
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
				path += ',L' + (xs[i-1] + 20) + ',' + ys[i - 1];
				path += ',L' + (xs[i] - 20) + ',' + ys[i];
				if (i < xs.length - 1) {
					path += ',L' + (xs[i] + 20) + ',' + ys[i];	
				} else {
					path += ',L' + xs[i] + "," + ys[i];
				}
			} else {	
				path += ',L' + (xs[i-1] - 20) + ',' + ys[i - 1];
				path += ',L' + (xs[i] + 20) + ',' + ys[i];
				if (i < xs.length - 1) {
					path += ',L' + (xs[i] - 20) + ',' + ys[i];	
				} else {
					path += ',L' + xs[i] + "," + ys[i];
				}
			}
		}
	}
	return path;
};

LineView.prototype.getWavyPath = function() {
	var stepsY = Math.round(Math.abs(this.line.get("point1").get('y') - this.line.get("point2").get('y')) / 3);
	var stepsX = Math.round(Math.abs(this.line.get("point1").get('x') - this.line.get("point2").get('x')) / 3);
	var steps = Math.max(stepsX, stepsY);

	var xs = numeric.linspace(this.line.get("point1").get('x'), this.line.get("point2").get('x'), steps);
	var ys = numeric.linspace(this.line.get("point1").get('y'), this.line.get("point2").get('y'), steps);
	var path = "";
	
	if ( steps == 0) {
		return this.getStraightPath();
	}

	for (var i = 0; i < steps; i++) {
		var x = xs.length > 0 ? xs[i] : this.line.get("point1").get('x');
		var y = ys.length > 0 ? ys[i] : this.line.get("point1").get('y');

		if (i == 0) {
			path += "M" + x + "," + y;
		} else {
			if (i%2 == 1) {
				if (i%4 == 3) {
					plPoint = this.midPoint(x, y, -7);
				} else {
					plPoint = this.midPoint(x, y, 7);
				}
				path += ",S" + plPoint[0] + "," + plPoint[1];
			} else {
				path += "," + x + "," + y;
			}
		}
	}
	path += ",L" + this.line.get("point2").get('x') + "," + this.line.get("point2").get('y');
	return path;
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

LineView.prototype.midPoint = function(x, y, dist) {
	var slope = (this.line.get('point1').get('x') - this.line.get('point2').get('x'))/(this.line.get('point2').get('y') - this.line.get('point1').get('y'));
	debugger;
	var x_ = x + dist/Math.sqrt(1 + slope*slope);
	var y_ = y + slope*(x_ - x);
	return [x_, y_]
}

/*-----  End of LineView  ------*/

