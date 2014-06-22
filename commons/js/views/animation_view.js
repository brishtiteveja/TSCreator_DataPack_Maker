define(["baseView"], function (BaseView) {
    var AnimationView = BaseView.extend({
        el: "#animation-list",
        events: {
            'keyup :input': 'updateAnimation',
            'click a[href="#play"]': 'play',
            'click a[href="#stop"]': 'stop',
            'click a[href="#rewind"]': 'rewind',
            'click a[href="#forward"]': 'forward',
        }
    });

    AnimationView.prototype.template = new EJS({
        url: '/commons/ejs/animation.ejs'
    });

    AnimationView.prototype.initialize = function (app) {
        this.app = app;
        this.animation = this.app.animation;
        this.listenTo(this.animation, 'change', this.render.bind(this));
        this.render();
    }

    AnimationView.prototype.render = function () {
        this.$el.html(this.template.render(this.animation.toJSON()));
        this.$age = this.$('input[name="age"]');
        this.$topAge = this.$('input[name="top-age"]');
        this.$baseAge = this.$('input[name="base-age"]');
        this.$stepSize = this.$('input[name="step-size"]');
    }

    AnimationView.prototype.updateAnimation = function (evt) {}

    AnimationView.prototype.ageChange = function () {}

    AnimationView.prototype.play = function () {};

    AnimationView.prototype.stop = function () {};

    AnimationView.prototype.rewind = function () {};

    AnimationView.prototype.forward = function () {};

    return AnimationView;
});