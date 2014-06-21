define(["baseView"], function(BaseView) {
	var DefaultView = BaseView.extend({
		el: "#defaults-list",
		events: {}
	});

	DefaultView.prototype.template = new EJS({
		url: '/commons/ejs/default.ejs'
	});

	DefaultView.prototype.initialize = function(app) {
		this.app = app;
		this.defaultOb = defaultOb;
		this.listenTo(this.app.lithology2dView.app.animation, 'change:age', this.ageChange.bind(this));
		this.render();
	}

	DefaultView.prototype.render = function() {
		this.$el.html(this.template.render(this.app.lithology2dView.app.animation.toJSON()));
		this.$age = this.$('input[name="age"]');
		this.addSlider();
	}

	DefaultView.prototype.updateAge = function(e, data) {
		this.app.lithology2dView.app.animation.set({
			age: parseFloat(data.values.max)
		})
	}

	return DefaultView;
});