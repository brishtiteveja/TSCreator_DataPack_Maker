define(["baseView"], function (BaseView) {
    var PointView = BaseView.extend({
        tagName: 'li',
        classname: "PointView",
        events: {
            'change input[name="relative-y"]': 'updatePoint',
            'change input[name="relative-x"]': 'updatePoint',
            'click .point-data': 'togglePointForm',
            'click .arrow': 'togglePointForm',
            'mouseover': "onMouseOver",
            'mouseout': "onMouseOut",
        }
    });

    PointView.prototype.template = new EJS({
        url: '../../transect_maker/ejs/point.ejs'
    });
    PointView.prototype.statusBoxTemplate = new EJS({
        url: '../../transect_maker/ejs/status_box.ejs'
    });

    PointView.prototype.initialize = function (app, point) {
        this.app = app;
        this.point = point;
        this.render();
        this.listenTo(this.point, 'destroy', this.removeElement.bind(this));
        this.listenTo(this.point, 'change:age', this.render.bind(this));
        this.listenTo(this.point, 'update', this.render.bind(this));
        this.listenTo(this.point, 'change:edit', this.toggleEditStatus.bind(this));
        this.listenTo(this.point, 'change:x', this.renderPoint.bind(this));
        this.listenTo(this.point, 'change:y', this.renderPoint.bind(this));
        this.listenTo(this.point.get('zone'), 'destroy', this.updatePointTransetAndZone.bind(this));
        this.listenTo(this.point.get('transect'), 'destroy', this.updatePointTransetAndZone.bind(this));
        this.listenTo(this.point.get('zone'), 'update', this.updatePointTransetAndZone.bind(this));
        this.listenTo(this.point.get('transect'), 'update', this.updatePointTransetAndZone.bind(this));
    };


    PointView.prototype.render = function () {
        this.$el.html(this.template.render(this.point.toJSON()));

        this.$toggle = this.$(".toggle"),
        this.$pointForm = this.$(".point-form");
        this.$pointData = this.$(".point-data");
        this.$pointName = this.$('input[name="point-name"]');
        this.$pointAge = this.$('input[name="point-age"]');
        this.$pointRelativeX = this.$('input[name="relative-x"]');
        this.$pointRelativeY = this.$('input[name="relative-y"]');

        this.renderPoint();
    };

    PointView.prototype.renderPoint = function () {
        if (this.element === undefined) {
            this.element = this.app.Paper.circle(this.point.get('x'), this.point.get('y'), 4);

            this.app.PointsSet.push(this.element);
            this.element.hover(this.onMouseOver.bind(this), this.onMouseOut.bind(this));
            this.element.click(this.onClick.bind(this));
            this.element.drag(this.onDragMove.bind(this), this.onDragStart.bind(this), this.onDragEnd.bind(this));

            this.element.attr({
                'fill': "#000000"
            });
        }

        this.updateElement();
        this.renderTooltip();
    };

    PointView.prototype.renderTooltip = function () {
        var content = this.point.get('name') + "<br/>";
        if (this.point.get('zone'))
            content += this.point.get('zone').get('name') + "<br/>";
        if (this.point.get('transect'))
            content += this.point.get('transect').get('name');
        $(this.element.node).qtip({
            content: {
                text: content
            },
            position: {
                my: 'bottom left', // Position my top left...
                target: 'mouse', // my target
                adjust: {
                    x: 10,
                    y: -10
                }
            }
        });
    }

    PointView.prototype.updateElement = function () {
        this.element.attr({
            'cx': this.point.get('x'),
            'cy': this.point.get('y'),
        });
        this.updateStatusBox();
    }

    PointView.prototype.updateStatusBox = function () {
        this.app.StatusBox.html(this.statusBoxTemplate.render(this.point.toStatusJSON()));
    }

    PointView.prototype.setFinishedMode = function () {
        this.element.attr({
            r: 4,
            fill: "#000000",
            stroke: "#000000"
        });
        this.$el.removeClass('hover');
    };

    PointView.prototype.setEditMode = function () {
        this.element.attr({
            r: 8,
            fill: "#FF0033",
            stroke: '#FF0033',
        });
        this.$el.addClass('hover');
    }

    PointView.prototype.hover = function () {
        this.element.attr({
            "r": 10
        });
    };

    PointView.prototype.unhover = function () {
        this.element.attr({
            "r": 5
        });
    };

    PointView.prototype.onMouseOver = function () {
        this.app.supressDoubleClick = true;
        this.updateStatusBox();
        this.setEditMode();
    };

    PointView.prototype.onMouseOut = function () {
        this.app.supressDoubleClick = false;
        this.setFinishedMode();
    };

    PointView.prototype.onClick = function () {
        if (this.app.CurrentPolygon !== null && this.app.CurrentPolygon.get('draw')) {
            this.app.CurrentPolygon.get('points').add(this.point);
        }
    }

    PointView.prototype.onDblClick = function (evt) {}

    PointView.prototype.removeElement = function () {
        this.element.remove();
    }

    PointView.prototype.onDragStart = function (x, y, evt) {}

    PointView.prototype.onDragMove = function (dx, dy, x, y, evt) {
        var locationX = evt.offsetX;
        var locationY = evt.offsetY;


        var cdts = ViewboxToPaper(this.app, locationX, locationY);
        locationX = cdts.x;
        locationY = cdts.y;

        if (this.app.Cursor.get('lockH')) {
            locationY = this.point.get('y');
        }

        if (this.app.Cursor.get('lockV')) {
            locationX = this.point.get('x');
        }


        this.point.set({
            x: locationX,
            y: locationY
        });
    }

    PointView.prototype.onDragEnd = function (evt) {

        var cdts = ViewboxToPaper(this.app, evt.offsetX, evt.offsetY);
        var transect = this.app.TransectsCollection.getTransectForX(cdts.x);
        var zone = this.app.ZonesCollection.getZoneForY(cdts.y);

        var locationX = this.point.get('x');
        var locationY = this.point.get('y');
        if (transect === null) {
            transect = this.point.get('transect');
            var x = transect.get('wellRight').get('x');
            if (locationX > x) {
                locationX = x - 1;
            }
            var x = transect.get('wellLeft').get('x');

            if (locationX < x) {
                locationX = x + 1;
            }
        }

        if (zone === null) {

            zone = this.point.get('zone');

            var y = zone.get('baseMarker').get('y');

            if (locationY > y) {
                locationY = y - 1;
            }

            var y = zone.get('topMarker').get('y');

            if (locationY < y) {
                locationY = y + 1;
            }

        }

        this.point.set({
            x: locationX,
            y: locationY
        });


        this.point.updateTransectAndZone();
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
            this.setEditMode();
        } else {
            this.$pointForm.addClass('hide');
            this.$toggle.removeClass('show-data');
            this.$pointData.removeClass('hide');
            this.$toggle.addClass('hide-data');
            this.setFinishedMode();
        }
    }

    PointView.prototype.updatePointTransetAndZone = function (model) {
        this.point.updateTransectAndZone();
        this.point.update();
    }

    PointView.prototype.updatePoint = function (evt) {
        if (evt.keyCode == TimescaleApp.ENTER || evt.keyCode == TimescaleApp.ESC) {
            this.togglePointForm();
        }

        var relX = this.$pointRelativeX.val() * 1.0 / 100;
        var relY = (100 - this.$pointRelativeY.val() * 1.0) / 100;

        if (this.point.get('transect') && this.point.get('zone')) {
            var x = this.point.get('transect').getAbsoluteX(relX);
            var y = this.point.get('zone').getAbsoluteY(relY);

            this.point.set({
                x: x,
                y: y
            });
            this.point.updateTransectAndZone();
        }
    }

    return PointView;
});
/*-----  End of PointView  ------*/
