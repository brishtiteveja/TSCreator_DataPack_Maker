define(["baseView"], function(BaseView) {
	var DefaultView = BaseView.extend({
		el: "#defaults-list",
		events: {
			'change input[name="age"]': 'updateAge',
		}
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
	}

	DefaultView.prototype.updateAge = function() {
		this.app.lithology2dView.app.animation.set({
			age: parseFloat(this.$age.val())
		})
	}

	DefaultView.prototype.ageChange = function() {}

	return DefaultView;
});