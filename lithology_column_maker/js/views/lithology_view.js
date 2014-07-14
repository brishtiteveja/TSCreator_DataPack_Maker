define(["baseView", "lithologyMarker"], function (BaseView, LithologyMarker) {

    var LithologyView = BaseView.extend({
        tagName: 'li',
        classname: "LithologyView",
        events: {
            'click .toggle': 'toggleLithologyForm',
            'click .lithology-data': 'toggleLithologyForm',
            'click .data-labels': 'toggleLithologyForm',
            'click .destroy': 'destroy',
            'keypress :input': 'updateLithology',
            'keyup :input': 'updateLithology',
            'change input[name="lithology-name"]': 'updateLithology',
            'change input[name="lithology-color"]': 'updateLithology',
            'change input[name="lithology-base-relativeY"]': 'updateLithology',
            'change select.lithology-line-style': 'updateLithology',
            'mouseover': "onMouseOver",
            'mouseout': "onMouseOut",
        }
    });

    LithologyView.prototype.template = new EJS({
        url: '/lithology_column_maker/ejs/lithology.ejs'
    });

    LithologyView.prototype.initialize = function (app, lithology) {
        this.app = app;
        this.lithology = lithology;
        this.top = this.lithology.get('top');
        this.base = this.lithology.get('base');

        if (this.lithologySet === undefined) {
            this.lithologySet = this.app.Paper.set();
            this.app.LithologysSet.push(this.lithologySet);
        }


        /* listen to the events */
        this.listenTo(this.lithology, 'change:edit', this.editLithology.bind(this));
        // this.listenTo(this.lithology, 'change:hover', this.setHoverStatus.bind(this));
        this.listenTo(this.lithology, 'update', this.renderLithology.bind(this));
        this.listenTo(this.lithology, 'change:pattern', this.renderLithology.bind(this));

        this.listenTo(this.lithology.get('lithologyGroup').get('lithologyColumn'), 'change:x', this.renderLithology
            .bind(this));
        this.listenTo(this.lithology.get('lithologyGroup').get('lithologyColumn'), 'change:width', this.renderLithology
            .bind(this));
        this.listenTo(this.lithology.get('lithologyGroup').get('lithologyMarkers'), 'add', this.checkAndDelete.bind(
            this));

        this.listenTo(this.top, 'update', this.renderLithology.bind(this));
        // this.listenTo(this.top, 'change:age', this.renderTooltip.bind(this));
        // this.listenTo(this.top, 'change:relativeY', this.renderTooltip.bind(this));
        this.listenTo(this.base, 'update', this.renderLithology.bind(this));
        // this.listenTo(this.base, 'change:age', this.renderTooltip.bind(this));
        // this.listenTo(this.base, 'change:relativeY', this.renderTooltip.bind(this));

        this.listenTo(this.lithology.get('settings'), 'change', this.renderLithology.bind(this));
        this.listenTo(this.lithology, 'destroy', this.delete.bind(this));

        this.render();

    };

    LithologyView.prototype.render = function () {
        var json = this.lithology.toJSON();
        json['app'] = this.app;
        this.$el.html(this.template.render(json));
        this.$toggle = this.$(".toggle");
        this.$lithologyForm = this.$(".lithology-form");
        this.$lithologyData = this.$(".lithology-data");
        this.$lithologyName = this.$('input[name="lithology-name"]')[0];
        this.$lithologyAge = this.$('input[name="lithology-age"]')[0];
        this.$lithologyDescription = this.$('textarea[name="lithology-description"]')[0];
        this.$patternsList = this.$('.patterns-list');
        this.$lithologyPattern = this.$('select.lithology-pattern');
        this.$lithologyImage = this.$('.lithology-image');
        this.$lithologyBaseRelativeY = this.$('input[name="lithology-base-relativeY"]')[0];

        this.$lithologyPattern.change(this.updateLithologyPattern.bind(this));

        /* check edit state */
        this.editLithology();

        this.renderLithology();
    };

    LithologyView.prototype.updateLithologyPattern = function () {
        var pattern = this.$('select.lithology-pattern option:selected').val();
        this.lithology.set({
            'pattern': pattern
        });
    }


    LithologyView.prototype.setLithologyFill = function () {
        if (this.lithBox === undefined) return;
        var pattern = this.lithology.get("pattern");
        var fill = pattern ? "url('/pattern_manager/patterns/" + this.app.patternsData[pattern].image + "')" :
            "#EEEEEE";
        var percent = pattern ? parseFloat(this.app.patternsData[pattern].width) / 100 : 1;
        var width = Math.round(this.lithology.get('lithologyGroup').get('lithologyColumn').get('width') * percent /
            2)
        this.lithBox.attr({
            'fill': fill,
            'width': width
        });
        var url = fill + " repeat-x";
        this.$lithologyImage.css("background", url);
    }


    LithologyView.prototype.renderLithology = function () {

        if (this.lithBox === undefined) {
            this.bgBox = this.app.Paper.rect();
            this.lithBox = this.app.Paper.rect();
            this.lithologyText = this.app.Paper.text();
            this.bBox = this.app.Paper.rect();

            this.lithologySet.push(this.lithBox);
            this.lithologySet.push(this.lithologyText);
            this.lithologySet.push(this.bBox);

            this.app.MarkersSet.toFront();
            this.app.LithologyMarkersSet.toFront();
            this.app.LithologyGroupMarkersSet.toFront();

            this.bBox.hover(this.onMouseOver.bind(this), this.onMouseOut.bind(this));

            /* attach listeners to the bBox so that when clicked it splits the lithology */
            this.bBox.dblclick(this.createLithologyMarker.bind(this));
        }


        this.bgBox.attr({
            "stroke-width": 0,
            "fill": "#FFFFFF",
            "x": this.lithology.get('lithologyGroup').get('lithologyColumn').get('x') + this.lithology.get(
                'lithologyGroup').get('lithologyColumn').get('width') / 2,
            "y": this.top.get('y'),
            "width": this.lithology.get('lithologyGroup').get('lithologyColumn').get('width') / 2,
            "height": this.base.get('y') - this.top.get('y'),
            "opacity": 0.5,
        });

        this.lithBox.attr({
            "stroke-width": 0,
            "fill": this.lithology.get('settings').get('backgroundColor'),
            "x": this.lithology.get('lithologyGroup').get('lithologyColumn').get('x') + this.lithology.get(
                'lithologyGroup').get('lithologyColumn').get('width') / 2,
            "y": this.top.get('y'),
            "width": this.lithology.get('lithologyGroup').get('lithologyColumn').get('width') / 2,
            "height": this.base.get('y') - this.top.get('y'),
            "opacity": 0.5,
        });

        var textX = Math.round(this.lithology.get('lithologyGroup').get('lithologyColumn').get('x') + this.lithology
            .get('lithologyGroup').get('lithologyColumn').get('width') / 2 + this.lithology.get(
                'lithologyGroup').get('lithologyColumn').get('width') / 4);
        var textY = Math.round((this.top.get('y') + this.base.get('y')) / 2)
        var textSize = Math.min(Math.round(this.base.get('y') - this.top.get('y')), 16);

        this.lithologyText.attr({
            "x": textX,
            "y": textY,
            "text": this.lithology.get('name'),
            "font-size": textSize,
        });

        this.bBox.attr({
            "stroke-width": 2,
            "opacity": 0,
            "fill": "#FFF",
            "x": this.lithology.get('lithologyGroup').get('lithologyColumn').get('x') + this.lithology.get(
                'lithologyGroup').get('lithologyColumn').get('width') / 2,
            "y": this.top.get('y'),
            "width": this.lithology.get('lithologyGroup').get('lithologyColumn').get('width') / 2,
            "height": this.base.get('y') - this.top.get('y'),
        });

        this.setLithologyFill();
        this.renderTooltip();
    }

    LithologyView.prototype.createLithologyMarker = function (evt) {
        if (!this.app.enLithologys) return;
        var lithologyMarker = this.lithology.get('lithologyGroup').get('lithologyColumn').get('lithologyMarkers').findWhere({
            y: evt.offsetY
        }) || new LithologyMarker({
            y: evt.offsetY,
            lithologyGroup: this.lithology.get('lithologyGroup')
        }, this.app);
        this.lithology.get('lithologyGroup').get('lithologyMarkers').add(lithologyMarker);
        this.lithology.get('lithologyGroup').get('lithologyColumn').get('lithologyMarkers').add(lithologyMarker);
        this.lithology.destroy();
    }

    LithologyView.prototype.renderTooltip = function () {
        $(this.bBox.node).qtip({
            content: {
                text: this.lithology.get('name') + "<br>" + (this.lithology.get('description') ||
                    "No description yet!")
            },
            position: {
                my: 'bottom left', // Position my top left...
                target: 'mouse', // my target 
            }
        });
    };

    LithologyView.prototype.onMouseOver = function () {
        this.$el.addClass('hover');
        this.hover();
    };

    LithologyView.prototype.onMouseOut = function () {
        this.$el.removeClass('hover');
        this.unhover();
    };


    LithologyView.prototype.setHoverStatus = function () {
        if (this.lithology.get('hover')) {
            this.$el.addClass('hover');
        } else {
            if (this.glow) this.glow.remove();
            this.$el.removeClass('hover');
        }
    }

    LithologyView.prototype.hover = function () {
        this.glow = this.bgBox.glow();
    };

    LithologyView.prototype.unhover = function () {
        if (this.glow) this.glow.remove();
    };

    LithologyView.prototype.toggleLithologyForm = function () {
        this.render();
        this.lithology.set({
            'edit': !this.lithology.get('edit')
        });
    };

    LithologyView.prototype.editLithology = function () {
        if (this.lithology.get('edit')) {
            this.$lithologyForm.removeClass('hide');
            this.$lithologyData.addClass('hide');
            this.$toggle.removeClass('hide-data');
            this.$toggle.addClass('show-data');
        } else {
            this.$lithologyForm.addClass('hide');
            this.$lithologyData.removeClass('hide');
            this.$toggle.removeClass('show-data');
            this.$toggle.addClass('hide-data');
        }
    };

    LithologyView.prototype.delete = function () {
        if (this.lithologyText) this.lithologyText.remove();
        if (this.bgBox) this.bgBox.remove();
        if (this.lithBox) this.lithBox.remove();
        if (this.bBox) this.bBox.remove();
        if (this.glow) this.glow.remove();
        this.$el.remove();
        this.remove();
    }

    LithologyView.prototype.destroy = function () {
        this.lithology.get('base').set({
            name: "TOP"
        });
        this.lithology.destroy();
    }

    LithologyView.prototype.updateLithology = function (evt) {
        if (evt.keyCode === TimescaleApp.ENTER || evt.keyCode === TimescaleApp.ESC) {
            this.toggleLithologyForm();
        }
        var name = this.$lithologyName.value;
        var description = this.$lithologyDescription.value;
        var style = this.$("select.lithology-line-style option:selected").val();

        var y = this.base.get('zone').getAbsoluteY((1 - parseFloat(this.$lithologyBaseRelativeY.value) / 100.0));

        this.base.set({
            y: y
        });

        this.lithology.set({
            name: name,
            description: description,
        });

        this.lithology.get('base').set({
            name: name + " Base"
        });

        this.base.set({
            style: style
        });

        this.lithology.update();
    }

    LithologyView.prototype.checkAndDelete = function (lithologyMarker) {
        if (lithologyMarker.get('y') > this.top.get('y') && lithologyMarker.get('y') < this.base.get('y')) {
            this.destroy();
        }
    }

    return LithologyView;
});