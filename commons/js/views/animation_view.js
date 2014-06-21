define(["baseView"], function(BaseView) {
	var AnimationView = BaseView.extend({
		el: "#animation-list",
		events: {
			'keyup :input': 'updateAnimation',
		}
	});

	AnimationView.prototype.template = new EJS({
		url: '/commons/ejs/animation.ejs'
	});

	AnimationView.prototype.initialize = function(app) {
		this.app = app;
		this.animation = this.app.animation;
		this.listenTo(this.animation, 'change:age', this.ageChange.bind(this));
		this.render();
	}

	AnimationView.prototype.render = function() {
		this.$el.html(this.template.render(this.animation.toJSON()));
		this.$age = this.$('input[name="age"]');
		this.$topAge = this.$('input[name="top-age"]');
		this.$baseAge = this.$('input[name="base-age"]');
		this.$stepSize = this.$('input[name="step-size"]');
	}

	AnimationView.prototype.updateAnimation = function(evt) {}

	AnimationView.prototype.ageChange = function() {}

	return AnimationView;
});