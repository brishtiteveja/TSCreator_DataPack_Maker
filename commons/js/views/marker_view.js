define(["baseView"], function (BaseView) {
    INF = 5000000;
    SMALLINF = 1000000;
    var MarkerView = BaseView.extend({
        tagName: 'li',
        classname: "MarkerView",
        events: {
            'click .toggle': 'toggleMarkerForm',
            'click .marker-data': 'toggleMarkerForm',
            'click .destroy': 'destroy',
            'keypress :input': 'updateMarker',
            'keyup :input': 'updateMarker',
            'mouseover': "onMouseOver",
            'mouseout': "onMouseOut",
        }
    });


    /*==========  Template to be used in generation marker in the settings side panel.  ==========*/
    MarkerView.prototype.template = new EJS({
        url: '../../commons/ejs/marker.ejs'
    });


    /*==========  Initialize the marker  ==========*/
    MarkerView.prototype.initialize = function (app, marker, markersView) {
        this.app = app;
        /* initialize the the view the the marker instance and the collecting view */
        this.markersView = markersView;
        this.marker = marker;

        /* render the marker as well as the settings */
        this.render();

        /* listen to the events */
        this.listenTo(this.marker, 'change:edit', this.editMarker.bind(this));
        this.listenTo(this.marker, 'change:hover', this.setHoverStatus.bind(this));
        this.listenTo(this.marker, 'update', this.renderMarker.bind(this));
        this.listenTo(this.marker, 'change:y', this.renderMarker.bind(this));
        this.listenTo(this.marker, 'destroy', this.delete.bind(this));
    };

    /*==========  render the block  ==========*/
    MarkerView.prototype.render = function () {
        this.$el.html(this.template.render(this.marker.toJSON()));
        /* get DOM elements after render */
        this.$toggle = this.$(".toggle");
        this.$markerForm = this.$(".marker-form");
        this.$markerData = this.$(".marker-data");
        this.$markerName = this.$('input[name="marker-name"]')[0];
        this.$markerAge = this.$('input[name="marker-age"]')[0];

        /* check edit state */
        this.editMarker();

        this.renderMarker();
    };

    /*==========  render the marker on the canvas  ==========*/
    MarkerView.prototype.renderMarker = function () {
        if (this.element === undefined) {
            this.element = this.app.Paper.path();
            this.element.attr({
                "stroke-width": 2,
                "stroke": "#900000"
            });

            /* attach listeners to the element */
            this.element.hover(this.onMouseOver.bind(this), this.onMouseOut.bind(this));
            this.element.drag(this.dragMove.bind(this), this.dragStart.bind(this), this.dragEnd.bind(this));
            this.element.toFront();
            this.app.MarkersSet.push(this.element);
        }
        this.element.attr({
            'path': this.getPath()
        });
        if (this.app.span) {} else {
            this.resizePaper();
        }

        this.renderTooltip();
    };

    /*==========  render the tooltip for the marker in the canvas  ==========*/
    MarkerView.prototype.renderTooltip = function () {
        var age = this.marker.get('age') === null ? '-' : this.marker.get('age');
        $(this.element.node).qtip({
            content: {
                text: this.marker.get('name') + "【" + age + " myr】"
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
    };

    /*==========  get path string for the marker  ==========*/
    MarkerView.prototype.getPath = function () {
    	var locationX1 = 0;
    	var locationX2 = this.app.width || this.app.Paper.width;
        var locationX1 = -SMALLINF;
        var locationX2 = SMALLINF;
        var locationY = this.marker.get('y');
        if (this.app.span) {
            var cdts = ViewboxToPaper(this.app, locationX1, locationY);
            locationX1 = cdts.x;
            locationY = cdts.y;
            locationX2 = ViewboxToPaper(this.app, locationX2, 0).x;
        }
        return "M" + locationX1 + "," + this.marker.get('y') + 'H' + locationX2;
    };

    /*==========  start dragging  ==========*/
    MarkerView.prototype.dragStart = function (x, y, evt) {
        this.element.toFront();
        var markers = this.app.MarkersCollection;
        var index = markers.indexOf(this.marker);
        this.prevMarker = markers.at(index - 1);
        this.nextMarker = markers.at(index + 1);
    };

    /*==========  while dragging  ==========*/
    MarkerView.prototype.dragMove = function (dx, dy, x, y, evt) {
        var locationX = evt.offsetX;
        var locationY = evt.offsetY;

        if (this.app.span) {
            var cdts = ViewboxToPaper(this.app, evt.offsetX, evt.offsetY);
            locationX = cdts.x;
            locationY = cdts.y;
        }

        if (this.prevMarker && this.nextMarker && (this.prevMarker.get('y') + 2 > locationY || locationY > this.nextMarker
            .get('y') - 2)) {
            return;
        }

        if (!this.prevMarker && this.nextMarker && locationY > this.nextMarker.get('y') - 2) {
            return;
        }

        if (this.prevMarker && !this.nextMarker && this.prevMarker.get('y') + 2 > locationY) {
            return;
        }

        this.marker.set({
            y: locationY
        });
    };

    /*==========  when dragging is completed update the points and texts relative locations ==========*/
    MarkerView.prototype.dragEnd = function (evt) {
        this.marker.dragEnd();
    };

    MarkerView.prototype.onMouseOver = function () {
        this.markersView.undelegateEvents();
        this.$el.addClass('hover');
        this.hover();
    };

    MarkerView.prototype.onMouseOut = function () {
        this.markersView.delegateEvents();
        this.$el.removeClass('hover');
        this.unhover();
    };

    MarkerView.prototype.hover = function () {
        this.element.attr({
            "stroke-width": 5
        });
    };

    MarkerView.prototype.unhover = function () {
        this.element.attr({
            "stroke-width": 2
        });
    };

    MarkerView.prototype.setHoverStatus = function () {
        if (this.marker.get('hover')) {

            this.$el.addClass('hover');
        } else {
            this.element.attr({
                "stroke-width": 2
            });

            this.$el.removeClass('hover');
        }
    }

    MarkerView.prototype.toggleMarkerForm = function () {
        this.render();
        this.marker.set({
            'edit': !this.marker.get('edit')
        });
    };

    MarkerView.prototype.editMarker = function () {
        if (this.marker.get('edit')) {
            this.$markerForm.removeClass('hide');
            this.$markerData.addClass('hide');
            this.$toggle.removeClass('hide-data');
            this.$toggle.addClass('show-data');
        } else {
            this.$markerForm.addClass('hide');
            this.$markerData.removeClass('hide');
            this.$toggle.removeClass('show-data');
            this.$toggle.addClass('hide-data');
        }
    };

    MarkerView.prototype.updateMarker = function (evt) {

        if (evt.keyCode == 13) {
            this.toggleMarkerForm();
        }

        var name = this.$markerName.value;
        var age = parseFloat(this.$markerAge.value) || 0;

        this.marker.set({
            name: name,
            age: age
        });

        this.marker.update();
    };

    MarkerView.prototype.delete = function () {
        if (this.element !== undefined) this.element.remove();
        this.$el.remove();
        this.remove();
    }

    MarkerView.prototype.destroy = function () {
        var zone1 = this.app.ZonesCollection.findWhere({
            topMarker: this.marker
        });
        var zone2 = this.app.ZonesCollection.findWhere({
            baseMarker: this.marker
        });
        this.marker.destroy();
        if (zone1) zone1.destroy();
        if (zone2) zone2.destroy();
    }


    MarkerView.prototype.resizePaper = function () {
        var height = Math.max(this.app.Paper.height, this.marker.get('y') + 100)
        this.app.Paper.setSize(this.app.Paper.width, height);
        if (this.app.ruler) {
            this.app.ruler.resize();
        }
    }

    return MarkerView;
});
