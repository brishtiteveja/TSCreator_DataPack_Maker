define(["raphael", "baseView"], function (Raphael, BaseView) {

    var MapView = BaseView.extend({
        el: "#map",
        events: {
            'dblclick': "addPoint"
        }
    });

    MapView.prototype.initialize = function (app) {
        this.app = app;
        this.app.po = org.polymaps;
        this.app.drag = this.app.po.drag();
        this.app.gridLayer = this.app.po.grid();
        this.app.mapLayer1 = this.app.po.image().url(
            "http://s3.amazonaws.com/com.modestmaps.bluemarble/{Z}-r{Y}-c{X}.jpg");
        this.app.mapLayer2 = this.app.po.image()
            .url(this.app.po.url("http://{S}tile.cloudmade.com" + "/1a1b06b230af4efdbb989ea99e9841af" // http://cloudmade.com/register
                    + "/998/256/{Z}/{X}/{Y}.png")
                .hosts(["a.", "b.", "c.", ""]));
        this.renderMap();

        this.$el.addClass('hide');
    }

    // Bing API key = 8ed10b1af7084b1abcb9d09a4b315367

    MapView.prototype.renderMap = function () {
        this.app.map = this.app.po.map()
            .container(this.app.Paper.canvas)
            .zoomRange([0, 9])
            .zoom(7)
            .add(this.app.mapLayer2)
        // .add(this.app.mapLayer1)
        .add(this.app.po.arrow())
            .add(this.app.po.wheel())
            .add(this.app.drag)
        this.points = [];

    }

    MapView.prototype.addPoint = function (evt) {
        var cdts = {
            x: evt.offsetX,
            y: evt.offsetY
        };

        var wCdts = this.app.map.pointLocation(cdts);
    }


    // MapView.prototype.change = function (evt) {
    //     if (this.app.map.zoom() > 8) {
    //         this.app.mapLayer1.visible(false);
    //         this.app.mapLayer2.visible(true);
    //     } else {
    //         this.app.mapLayer1.visible(true);
    //         this.app.mapLayer2.visible(false);
    //     }
    // }


    return MapView;
});