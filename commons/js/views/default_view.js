define(["baseView"], function (BaseView) {
    var DefaultView = BaseView.extend({
        el: "#defaults-list",
        events: {
            'change input': 'updateDefaults'
        }
    });

    DefaultView.prototype.template = new EJS({
        url: '/commons/ejs/default.ejs'
    });

    DefaultView.prototype.initialize = function (app) {
        this.app = app;
        this.defaultOb = app.defaultOb;
        if (this.app.type === "lithology") {
            this.listenTo(this.app.LithologyMarkersCollection, 'change', this.updateDefaultValues.bind(this));
        } else {
            this.listenTo(this.app.MarkersCollection, 'change', this.updateDefaultValues.bind(this));
        }
        this.listenTo(this.defaultOb, 'update', this.render.bind(this));
        this.render();
    }

    DefaultView.prototype.render = function () {
        this.$el.html(this.template.render(this.defaultOb.toJSON()));
        this.$age = this.$('input[name="age"]');
        this.$topAge = this.$('input[name="top-age"]');
        this.$baseAge = this.$('input[name="base-age"]');
        this.$verticalScale = this.$('input[name="vertical-scale"]');
        this.$pixels = this.$('input[name="pixels"]');
    }

    DefaultView.prototype.updateAge = function (e, data) {
        this.app.lithology2dView.app.animation.set({
            age: parseFloat(data.values.max)
        })
    }

    DefaultView.prototype.updateDefaultValues = function () {
        if (this.app.type === "lithology") {
            this.defaultOb.set({
                top: this.app.LithologyMarkersCollection.first().get('age'),
                base: this.app.LithologyMarkersCollection.last().get('age')
            });

            if (this.app.animation) {
                this.app.animation.set({
                    top: this.app.LithologyMarkersCollection.first().get('age'),
                    base: this.app.LithologyMarkersCollection.last().get('age'),
                    age: this.app.LithologyMarkersCollection.first().get('age')
                });
                this.app.animation.update();
            }
        }

        this.defaultOb.update();
    };

    DefaultView.prototype.updateDefaults = function() {
        this.defaultOb.set({
            verticalScale: this.$verticalScale.val(),
            pixPerUnit: this.$pixels.val()
        });
    };

    return DefaultView;
});