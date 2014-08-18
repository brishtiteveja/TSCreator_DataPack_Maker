define(["baseView", "point", "pointView"], function (BaseView, Point, PointView) {

    var PolygonView = BaseView.extend({
        tagName: "li",
        events: {
            'click .toggle-polygon': 'toggleForm',
            'click .polygon-data': 'toggleForm',
            'click .polygon-form .data-labels': 'toggleForm',
            'click a.polygon-list-tool': 'showList',
            'click a[href="#polygon-destroy"]': 'destroy',
            'click a[href="#new-point"]': 'addNewPoint',
            'click .to-front': 'toFront',
            'keypress :input.polygon': 'updatePolygon',
            'keyup :input.polygon': 'updatePolygon',
            'mouseover': "onMouseOver",
            'mouseout': "onMouseOut",
        }
    });

    PolygonView.prototype.initialize = function (app, polygon) {
        this.app = app;
        this.polygon = polygon;
        this.listenToActionEvents();
        this.render();
    }

    PolygonView.prototype.template = new EJS({
        url: '/lithology_2D/ejs/polygon.ejs'
    });

    PolygonView.prototype.listenToActionEvents = function () {
        // add a point when we double click on canvas.
        this.listenTo(this.polygon, 'update', this.render.bind(this));
        this.listenTo(this.polygon.get('points'), 'add', this.addPoint.bind(this));
        this.listenTo(this.polygon.get('points'), 'change', this.renderPolygonElement.bind(this));
        this.listenTo(this.app.animation, 'change:age', this.setPolygonFill.bind(this));
        this.listenTo(this.app.animation, 'toggle-labels', this.toggleLabels.bind(this));

        /* destroy the view  if the model is  removed from the collection.*/
        this.listenTo(this.polygon, 'destroy', this.delete.bind(this));

        $("#map").dblclick(this.createPoint.bind(this));

    }

    PolygonView.prototype.render = function () {

        if (!this.pointSet) {
            this.pointSet = this.app.Paper.set();
        }
        // render the view for the polygon in the settings panel.
        this.$el.html(this.template.render(this.polygon.toJSON()));

        // get the appropriate dom elements from the newly added view
        this.$points = this.$(".points");
        this.$togglePolygon = this.$(".toggle-polygon");
        this.$polygonForm = this.$(".polygon-form");
        this.$polygonData = this.$(".polygon-data");
        this.$polygonName = this.$('input[name="polygon-name"]')[0];
        this.$polygonDescription = this.$('textarea[name="polygon-description"]')[0];

        this.renderPoints();
    }

    PolygonView.prototype.renderPoints = function () {
        this.polygon.get('points').each(this.addPoint.bind(this));
    }


    PolygonView.prototype.addPoint = function (point) {
        var pointView = new PointView(this.app, point);
        this.$points.append(pointView.el);
        this.pointSet.push(pointView.element);
        this.renderPolygonElement();
    }

    PolygonView.prototype.renderPolygonElement = function () {
        if (this.polygon.get('points').size() < 2) {
            return;
        }

        if (!this.element) {
            this.element = this.app.Paper.path();
            this.app.PolygonSet.push(this.element);
            this.element.mouseover(this.onMouseOver.bind(this));
            this.element.mouseout(this.onMouseOut.bind(this));

        }

        this.element.attr({
            path: this.getPath(),
            stroke: "#ff0000",
            fill: "#FFFFFF",
            opacity: 0.8
        });

        this.app.orderElements();
        this.renderLabel();
    }

    PolygonView.prototype.renderLabel = function () {
        if (this.polygon.get('points').size() < 2) {
            return;
        }

        var cdts = this.polygon.centroid();

        if (this.label == undefined) {
            this.label = this.app.Paper.text();
            this.app.PolygonLabelsSet.push(this.label);
        }
        this.label.attr({
            'x': cdts.x,
            'y': cdts.y,
            'text': this.polygon.get('name'),
            'font-size': 12,
            'stroke': "#000"
        });
        this.label.toFront();
    };

    PolygonView.prototype.createPoint = function (evt) {
        if (!this.polygon.get('draw')) {
            return;
        }

        var cdts = {
            x: evt.offsetX,
            y: evt.offsetY
        };

        var wCdts = this.app.map.pointLocation(cdts);

        var point = this.polygon.get('points').findWhere({
            lat: wCdts.lat,
            lon: wCdts.lon
        }) || new Point({
            x: evt.offsetX,
            y: evt.offsetY,
            lat: wCdts.lat,
            lon: wCdts.lon
        }, this.app);

        this.polygon.get('points').add(point);
    }

    PolygonView.prototype.addNewPoint = function () {
        var point = new Point({});
        this.polygon.get('points').add(point);
        point.set({
            edit: true
        });
    };


    PolygonView.prototype.getPath = function () {
        var path = 'M';
        var self = this;
        this.polygon.get('points').each(function (point, index, points) {
            if (index == 0) {
                path += point.get('x') + ',' + point.get('y');
            } else {
                path += "L" + point.get('x') + ',' + point.get('y');
            }
        });

        path += "Z";
        return path;
    }

    PolygonView.prototype.toggleForm = function () {
        this.$polygonForm.toggleClass('hide');
        this.$polygonData.toggleClass('hide');
        this.$togglePolygon.toggleClass('hide-data');
        this.$togglePolygon.toggleClass('show-data');
    }

    PolygonView.prototype.onMouseOver = function () {
        if (!this.element) return;

        if (this.glow !== undefined) {
            this.glow.remove();
        }
        this.glow = this.element.glow({
            color: "#f00",
            width: 40,
            opacity: 1,
        });
        this.glow.show();
        this.$el.addClass('hover');
    }

    PolygonView.prototype.onMouseOut = function () {
        if (!this.element) return;

        if (this.polygon.isSimple()) {
            this.setPolygonFill();
        } else {
            this.setErrorFill();
        }
        if (this.glow !== undefined) {
            this.glow.hide();
        }
        this.$el.removeClass('hover');
    }


    PolygonView.prototype.setErrorFill = function () {}


    PolygonView.prototype.setPolygonFill = function () {
        if (!this.element) return;
        var lithology = this.polygon.get('lithologyColumn').getLithologyForAge(this.app.animation.get('age'));
        if (lithology) {
            var pattern = lithology.get("pattern");
            var fill = pattern ? "url('/pattern_manager/patterns/" + this.app.patternsData[pattern].image + "')" :
                "#FFFFFF";
            if (fill !== this.element.attr('fill')) {
                this.element.attr({
                    'opacity': 0.5,
                    'stroke': 0,
                    'fill': fill
                });
            }
        } else {
            this.element.attr({
                'opacity': 0.5,
                'stroke': 0,
                'fill': "#FFFFFF"
            });
        }
    }

    PolygonView.prototype.updatePolygonView = function () {
        this.renderPolygonElement();
        this.setPolygonFill();
    }

    PolygonView.prototype.updatePolygon = function (evt) {
        if (evt.keyCode == TimescaleApp.ENTER || evt.keyCode == TimescaleApp.ESC) {
            this.polygon.update();
        }


        this.polygon.set({
            name: this.$polygonName.value,
            description: this.$polygonDescription.value.split("\n").join(" ")
        });
    }

    PolygonView.prototype.destroy = function () {
        _.invoke(this.polygon.get('points').toArray(), 'destroy');
        this.polygon.destroy();
    }


    PolygonView.prototype.delete = function () {
        if (this.element !== undefined) this.element.remove();
        if (this.glow !== undefined) this.glow.remove();
        this.$el.remove();
        this.remove();
    }

    PolygonView.prototype.toggleLabels = function () {
        if (!this.show) {
            this.show = true;
            this.label.hide();
        } else {
            this.show = false;
            this.label.show();
        }
    };

    return PolygonView;
});