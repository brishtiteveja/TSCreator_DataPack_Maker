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
        this.$play = this.$('a[href="#play"]');
        this.$stop = this.$('a[href="#stop"]');
        this.$rewind = this.$('a[href="#rewind"]');
        this.$forward = this.$('a[href="#forward"]');
        this.$animationTool = this.$(".animation-tool");
    }

    AnimationView.prototype.play = function () {
        this.$animationTool.removeClass('alert');
        this.playing = setInterval(this.updateAge.bind(this), 1000);
    };

    AnimationView.prototype.updateAge = function () {
        this.$play.addClass('alert');
        var newAge = Math.round((this.animation.get('age') + this.animation.get('step')) * 100) / 100;
        if (this.animation.get('age') < this.animation.get('base')) {
            this.animation.set({
                'age': newAge
            });
        } else {
            if (this.playing) {
                clearInterval(this.playing);
            }
        }
    };

    AnimationView.prototype.stop = function () {
        this.$animationTool.removeClass('alert');
        this.$stop.addClass('alert');
        if (this.playing) {
            clearInterval(this.playing);
        }
    };

    AnimationView.prototype.rewind = function () {
        this.$animationTool.removeClass('alert');
        this.$rewind.addClass('alert');
    };

    AnimationView.prototype.forward = function () {
        this.$animationTool.removeClass('alert');
        this.$forward.addClass('alert');
    };

    return AnimationView;
});