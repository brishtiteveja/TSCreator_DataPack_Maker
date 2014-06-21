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
		this.defaultOb = app.defaultOb;
		this.listenTo(this.defaultOb, 'change:age', this.ageChange.bind(this));
		this.render();
	}

	DefaultView.prototype.render = function() {
		this.$el.html(this.template.render(this.defaultOb.toJSON()));
		this.$age = this.$('input[name="age"]');
		this.$topAge = this.$('input[name="top-age"]');
		this.$baseAge = this.$('input[name="base-age"]');
	}

	DefaultView.prototype.updateAge = function(e, data) {
		this.app.lithology2dView.app.animation.set({
			age: parseFloat(data.values.max)
		})
	}

	DefaultView.prototype.ageChange = function() {}

	return DefaultView;
});