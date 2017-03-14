define(["baseView"], function (BaseView) {
    var AnimationView = BaseView.extend({
        el: "#animation-list",
        events: {
            'keyup :input': 'updateAnimation',
            'click a[href="#play"]': 'play',
            'click a[href="#stop"]': 'stop',
            'click a[href="#rewind"]': 'rewind',
            'click a[href="#forward"]': 'forward',
            'click a.toggle-labels': 'toggleLabels',
        }
    });

    AnimationView.prototype.template = new EJS({
        url: '../../commons/ejs/animation.ejs'
    });

    AnimationView.prototype.initialize = function (app) {
        this.app = app;
        this.animation = this.app.animation;
        this.listenTo(this.animation, 'update', this.render.bind(this));
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
        this.$('select[name="map-layer"]').change(this.updateMap.bind(this));
    }

    AnimationView.prototype.play = function () {
        this.$animationTool.removeClass('alert');
        this.$play.addClass('alert');
        if (this.playing) {
            clearInterval(this.playing);
        }
        this.playing = setInterval(this.updateAge.bind(this), 1000);
    };

    AnimationView.prototype.updateAge = function () {
        var newAge = Math.round((this.animation.get('age') + this.animation.get('step')) * 100) / 100;
        if (this.animation.get('age') < this.animation.get('base')) {
            this.animation.set({
                'age': newAge
            });
            this.animation.update();
        } else {
            if (this.playing) {
                this.$play.removeClass('alert');
                clearInterval(this.playing);
            }
        }
        this.$play.addClass('alert');
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
        if (this.playing) {
            clearInterval(this.playing);
        }
        this.playing = setInterval(this.updateAge.bind(this), 1000);
    };

    AnimationView.prototype.forward = function () {
        this.$animationTool.removeClass('alert');
        this.$forward.addClass('alert');
    };

    AnimationView.prototype.updateAnimation = function (evt) {

        this.animation.set({
            age: parseFloat(this.$age.val()) || this.animation.get('age'),
            top: parseFloat(this.$topAge.val()) || this.animation.get('top'),
            base: parseFloat(this.$baseAge.val()) || this.animation.get('base'),
            step: parseFloat(this.$stepSize.val()) || this.animation.get('step')
        });
        if (evt.keyCode == TimescaleApp.ENTER) {
            this.animation.update();
        }
    };

    AnimationView.prototype.updateMap = function () {
        var mapLayer = this.$('select[name="map-layer"]').val();
        this.app.mapOb.set({
            layer: mapLayer
        });
    };

    AnimationView.prototype.toggleLabels = function () {
        this.$('a[href="#show-labels"]').parent().toggleClass('hide');
        this.$('a[href="#hide-labels"]').parent().toggleClass('hide');
        this.animation.toggleLabels();
    };

    return AnimationView;
});
