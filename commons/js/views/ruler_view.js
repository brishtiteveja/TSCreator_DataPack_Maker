define(["baseView", "ruler"], function(BaseView, Ruler) {
	var RulerView = BaseView.extend({
		el: "#ruler-panel",
	});

	RulerView.prototype.initialize = function(app) {
		this.app = app;
		this.app.rulerCol = {};
		this.app.ruler = new Ruler({
			top: 0,
			base: 15,
			verticalScale: 1
		});
		this.ruler = this.app.ruler;
		this.$paper = $("#ruler-panel");


		this.render();
		this.listenTo(this.ruler, 'resize', this.resize.bind(this));
		this.listenToActionEvents();
	}


	RulerView.prototype.resize = function() {}

	RulerView.prototype.render = function() {
		this.app.rulerCol.$paper = this.$paper;
		this.Paper = Raphael(this.$paper[0], 50, this.app.Paper.height);
		this.app.rulerCol.Paper = this.Paper;
		this.renderRuler();
	}

	RulerView.prototype.renderRuler = function() {
		if (!this.element) {
			this.element = this.Paper.rect(0, 0, 50, this.app.Paper.height);
		}

		if (!this.marksSet) {
			this.marksSet = this.Paper.set();
		} else {
			this.marksSet.remove();
		}

		this.element.attr({
			width: this.$paper.width(),
			height: this.app.Paper.height,
			opacity: 0
		});

		var baseAge = Math.max(parseInt(this.ruler.get('base')), this.ruler.getAge(this.app.Paper.height));
		for (var age = parseInt(this.ruler.get('top')); age < baseAge + 1; age++) {
			this.drawMark(age);
		}
	}

	RulerView.prototype.drawMark = function(age) {
		var y = this.ruler.getY(age);

		if (age % 5) {
			var path = this.Paper.path("M0," + y + 'H' + this.ruler.get("width") / 2);
			this.Paper.text(this.ruler.get("width"), y, age);
			this.marksSet.push(path);
		} else {
			var label = this.Paper.path("M0," + y + 'H' + this.ruler.get("width"));
			this.Paper.text(this.ruler.get("width") * 2, y, age);
			this.marksSet.push(label);
		}
	}

	RulerView.prototype.listenToActionEvents = function() {
		var self = this;
		this.$enRulerPanel = $('a[href="#show-ruler"]');
		this.$enRulerPanel.click(function() {
			self.$paper.toggleClass("hidden");
		})
	}

	return RulerView;
});