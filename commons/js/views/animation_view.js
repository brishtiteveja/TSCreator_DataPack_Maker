define(["baseView"], function(BaseView) {
	var AnimationView = BaseView.extend({
		el: "#defaults-list",
		events: {}
	});

	// AnimationView.prototype.template = new EJS({
	// 	url: '/commons/ejs/default.ejs'
	// });

	AnimationView.prototype.initialize = function(app) {
		this.app = app;
		this.listenTo(this.app.lithology2dView.app.animation, 'change:age', this.ageChange.bind(this));
		this.render();
	}

	AnimationView.prototype.render = function() {
		this.$el.html(this.template.render(this.app.lithology2dView.app.animation.toJSON()));
		this.$age = this.$('input[name="age"]');
		this.addSlider();
	}

	AnimationView.prototype.updateAge = function(e, data) {
		this.app.lithology2dView.app.animation.set({
			age: parseFloat(data.values.max)
		})
	}

	AnimationView.prototype.ageChange = function() {}

	return AnimationView;
});