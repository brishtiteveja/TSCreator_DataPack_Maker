define(["baseView"], function (BaseView) {
    var PointView = BaseView.extend({
        tagName: 'li',
        events: {
            'click .point-data': 'togglePointForm',
            'click .arrow': 'togglePointForm',
            'keyup input[name="lat"]': 'updatePoint',
            'keyup input[name="lon"]': 'updatePoint',
            'change input[name="lat"]': 'updatePoint',
            'change input[name="lon"]': 'updatePoint'
        }
    });

    PointView.prototype.template = new EJS({
        url: '/lithology_2D/ejs/point.ejs'
    });

    PointView.prototype.statusBoxTemplate = new EJS({
        url: '/lithology_2D/ejs/status_box.ejs'
    });

    PointView.prototype.initialize = function (app, point) {
        this.app = app;
        this.point = point;
        this.render();

        this.app.map.on("move", this.updateLatLon.bind(this));
        this.listenTo(this.point, 'change:x', this.renderPoint.bind(this));
        this.listenTo(this.point, 'change:y', this.renderPoint.bind(this));
        this.listenTo(this.point, 'change:lat', this.updateLatLon.bind(this));
        this.listenTo(this.point, 'change:lon', this.updateLatLon.bind(this));
        this.listenTo(this.point, 'change:edit', this.toggleEditStatus.bind(this));
        this.listenTo(this.point, 'destroy', this.delete.bind(this));
    }

    PointView.prototype.render = function () {
        this.$el.html(this.template.render(this.point.toJSON()));

        this.$toggle = this.$(".toggle"),
        this.$pointForm = this.$(".point-form");
        this.$pointData = this.$(".point-data");
        this.$pointLat = this.$('input[name="lat"]');
        this.$pointLon = this.$('input[name="lon"]');

        this.renderPoint();
    }

    PointView.prototype.renderPoint = function () {
        if (this.element === undefined) {
            this.element = this.app.Paper.circle(this.point.get('x'), this.point.get('y'), 4);

            this.element.hover(this.onMouseOver.bind(this), this.onMouseOut.bind(this));
            // this.element.click(this.onClick.bind(this));
            this.element.drag(this.onDragMove.bind(this), this.onDragStart.bind(this), this.onDragEnd.bind(this));

            this.element.attr({
                'fill': "#ffff00"
            });

            this.app.PointSet.push(this.element);
        }

        this.updateElement();
        this.updateStatusBox();
        this.updateLatLon();
    }

    PointView.prototype.makePointRed = function () {
        this.element.attr({
            'fill': "#FF0000"
        });
    };

    PointView.prototype.updateElement = function () {

        var cdts = {
            x: this.point.get('x'),
            y: this.point.get('y')
        };

        var wCdts = this.app.map.pointLocation(cdts);

        this.element.attr({
            'cx': this.point.get('x'),
            'cy': this.point.get('y')
        });

        this.point.set({
            lat: wCdts.lat,
            lon: wCdts.lon
        });
    }

    PointView.prototype.updateLatLon = function () {

        var wCdts = {
            lat: this.point.get('lat'),
            lon: this.point.get('lon')
        };

        var cdts = this.app.map.locationPoint(wCdts);

        this.point.set({
            x: cdts.x || this.point.get('x'),
            y: cdts.y || this.point.get('y')
        });
    }

    PointView.prototype.onDragStart = function (x, y, evt) {
        this.element.toFront();
        this.app.map.remove(this.app.drag);
    }

    PointView.prototype.onDragMove = function (x, y, dx, dy, evt) {
        this.point.set({
            x: evt.offsetX,
            y: evt.offsetY
        });
    }

    PointView.prototype.onDragEnd = function (evt) {
        this.app.map.add(this.app.drag);
    }

    PointView.prototype.onMouseOver = function (evt) {
        this.element.attr({
            "r": 10
        });
    }

    PointView.prototype.onMouseOut = function (evt) {
        this.element.attr({
            "r": 5
        });
    }

    PointView.prototype.delete = function () {
        if (this.element) this.element.remove();
        this.$el.remove();
        this.remove();
    }


    PointView.prototype.updateStatusBox = function () {
        this.app.StatusBox.html(this.statusBoxTemplate.render(this.point.toJSON()));
    }

    PointView.prototype.togglePointForm = function () {
        this.render();
        this.point.set({
            'edit': !this.point.get('edit')
        });
    }

    PointView.prototype.toggleEditStatus = function () {
        if (this.point.get('edit')) {
            this.$pointForm.removeClass('hide');
            this.$pointData.addClass('hide');
            this.$toggle.removeClass('hide-data');
            this.$toggle.addClass('show-data');
        } else {
            this.$pointForm.addClass('hide');
            this.$toggle.removeClass('show-data');
            this.$pointData.removeClass('hide');
            this.$toggle.addClass('hide-data');
        }
    }


    PointView.prototype.updatePoint = function (evt) {
        if (evt.keyCode == TimescaleApp.ENTER || evt.keyCode == TimescaleApp.ESC) {
            this.togglePointForm();
            this.app.map.center({
                lat: this.point.get('lat'),
                lon: this.point.get('lon')
            })
        }

        this.point.set({
            lat: this.$pointLat.val(),
            lon: this.$pointLon.val()
        });
    }

    return PointView;
});