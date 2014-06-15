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

	DefaultView.prototype.ageChange = function() {}

	DefaultView.prototype.addSlider = function() {
		this.$(".slider").rangeSlider({
			defaultValues: {
				min: 0,
				max: 10
			},
			bounds: {
				min: 0,
				max: 100
			}
		});
		this.$(".slider").bind("valuesChanged", this.updateAge.bind(this));
	}

	return DefaultView;
});