define(["baseView"], function (BaseView) {

    var LithologyMarkerView = BaseView.extend({
        classname: "LithologyMarkerView",
    });

    LithologyMarkerView.prototype.statusBoxTemplate = new EJS({
        url: '/lithology_column_maker/ejs/status_box.ejs'
    });

    LithologyMarkerView.prototype.initialize = function (app, lithologyMarker) {
        this.app = app;
        this.lithologyMarker = lithologyMarker;

        this.listenTo(this.lithologyMarker.get('lithologyGroup').get('lithologyColumn'), 'change:x', this.renderLithologyMarker
            .bind(this));
        this.listenTo(this.lithologyMarker.get('lithologyGroup').get('lithologyColumn'), 'change:width', this.renderLithologyMarker
            .bind(this));

        /* listen to the events */
        this.listenTo(this.lithologyMarker, 'change', this.renderLithologyMarker.bind(this));
        this.listenTo(this.lithologyMarker, 'destroy', this.delete.bind(this));
        this.listenTo(this.lithologyMarker.get('lithologys'), 'remove', this.checkAndDelete.bind(this));
        this.listenTo(this.app.ZonesCollection, 'remove', this.updateLithologyMarker.bind(this));
        this.listenTo(this.app.ZonesCollection, 'change', this.updateLithologyMarker.bind(this));

        if (this.lithologyMarker.get('lithologyGroupMarker')) {
            this.listenTo(this.lithologyMarker.get('lithologyGroupMarker'), 'change:y', this.moveLithologyMarkerWithGroupMarker
                .bind(this));
        }

        this.render();
    };

    LithologyMarkerView.prototype.render = function () {
        this.renderLithologyMarker();
    };

    LithologyMarkerView.prototype.renderLithologyMarker = function () {

        if (this.element === undefined) {
            this.element = this.app.Paper.path();

            this.element.attr({
                "stroke-width": 2,
                "stroke": "#0000FF"
            });

            // this.element.click(this.onClick.bind(this));
            this.element.hover(this.onMouseOver.bind(this), this.onMouseOut.bind(this));
            this.element.drag(this.dragMove.bind(this), this.dragStart.bind(this), this.dragEnd.bind(this));

            this.app.LithologyMarkersSet.push(this.element);

            this.app.MarkersSet.toFront();
        }

        var style = this.lithologyMarker.get('style');
        var strokeDashArray = []

        if (style === "dashed") {
            strokeDashArray = ["-"];
        } else if (style === "dotted") {
            strokeDashArray = ["."];
        }

        this.element.attr({
            "path": this.getPath(),
            "stroke-dasharray": strokeDashArray,
        });

        this.lithologyMarker.updateZone();
        this.updateStatusBox();

        if (this.lithologyMarker.get('lithologyGroupMarker')) {
            this.lithologyMarker.get('lithologyGroupMarker').set({
                y: this.lithologyMarker.get('y')
            });
        }
    }

    LithologyMarkerView.prototype.moveLithologyMarkerWithGroupMarker = function () {
        this.lithologyMarker.set({
            y: this.lithologyMarker.get('lithologyGroupMarker').get('y')
        });
    }

    LithologyMarkerView.prototype.updateStatusBox = function () {
        this.app.StatusBox.html(this.statusBoxTemplate.render(this.lithologyMarker.toJSON()));
    }


    LithologyMarkerView.prototype.getPath = function () {
        var width = Math.floor(this.lithologyMarker.get('lithologyGroup').get('lithologyColumn').get('width') / 2);
        var x1 = this.lithologyMarker.get('lithologyGroup').get('lithologyColumn').get('x') + width;
        var x2 = x1 + width;
        return ("M" + x1 + "," + this.lithologyMarker.get('y') + "H" + x2);
    }

    /*==========  start dragging  ==========*/
    LithologyMarkerView.prototype.dragStart = function (x, y, evt) {
        var markers = this.lithologyMarker.get('lithologyGroup').get('lithologyMarkers');
        var index = markers.indexOf(this.lithologyMarker);
        this.prevMarker = markers.at(index - 1);
        this.nextMarker = markers.at(index + 1);
    };

    /*==========  while dragging  ==========*/
    LithologyMarkerView.prototype.dragMove = function (dx, dy, x, y, evt) {

        if (this.prevMarker && this.nextMarker && (this.prevMarker.get('y') + 2 > evt.offsetY || evt.offsetY > this
            .nextMarker.get('y') - 2)) {
            return;
        }

        if (!this.prevMarker && this.nextMarker && evt.offsetY > this.nextMarker.get('y') - 2) {
            return;
        }

        if (this.prevMarker && !this.nextMarker && this.prevMarker.get('y') + 2 > evt.offsetY) {
            return;
        }

        this.lithologyMarker.set({
            y: evt.offsetY
        });

    };

    LithologyMarkerView.prototype.dragEnd = function (evt) {};

    LithologyMarkerView.prototype.onMouseOver = function () {
        this.$el.addClass('hover');
        this.hover();
    };

    LithologyMarkerView.prototype.onMouseOut = function () {
        this.$el.removeClass('hover');
        this.unhover();
    };

    LithologyMarkerView.prototype.hover = function () {
        this.element.attr({
            "stroke-width": 5
        });
    };

    LithologyMarkerView.prototype.unhover = function () {
        this.element.attr({
            "stroke-width": 2
        });
    };


    LithologyMarkerView.prototype.setHoverStatus = function () {
        if (this.lithologyMarker.get('hover')) {
            this.hover();
            this.$el.addClass('hover');
        } else {
            this.unhover();
            this.$el.removeClass('hover');
        }
    }

    LithologyMarkerView.prototype.delete = function () {
        if (this.element !== undefined) this.element.remove();
        this.$el.remove();
        this.remove();
    }

    LithologyMarkerView.prototype.checkAndDelete = function () {
        if (this.lithologyMarker.get('lithologys').length == 0) {
            this.destroy();
        }
    }

    LithologyMarkerView.prototype.destroy = function () {
        this.lithologyMarker.destroy();
    }

    LithologyMarkerView.prototype.updateLithologyMarker = function (zone) {
        if (zone !== this.lithologyMarker.get('zone')) {
            return;
        }
        this.lithologyMarker.updateZone();
        this.render();

    }

    return LithologyMarkerView;
});