define(["baseView"], function(BaseView) {
	var DefaultView = BaseView.extend({
		el: "#defaults-list"
	});

	DefaultView.prototype.template = new EJS({
		url: '/commons/ejs/default.ejs'
	});

	DefaultView.prototype.initialize = function(app) {
		this.app = app;
		this.render();
	}

	DefaultView.prototype.render = function() {
		this.$el.html(this.template.render({}));
	}

	return DefaultView;
});