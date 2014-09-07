define([], function () {
    var Exporter = function (app) {
        this.app = app;
    }

    Exporter.prototype.export = function () {
        initialize();
    };

    Exporter.prototype.initialize = function () {
        this.markers = this.app.markersCollection;
        this.zones = this.app.ZonesCollection;
        this.evTree = this.app.app.evTree;
    };

    return Exporter;
})