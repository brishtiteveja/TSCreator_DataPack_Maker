define([], function () {
    var Exporter = function (app) {
        this.app = app;
    }

    Exporter.prototype.export = function () {
        this.initialize();
    };

    Exporter.prototype.initialize = function () {
        this.markers = this.app.markersCollection;
        this.zones = this.app.ZonesCollection;
        this.evTree = this.app.evTree;
    };


    Exporter.prototype.getJSON = function () {
        var json = {};
        json["zones"] = this.zones.toJSON();
        json["evTree"] = this.evTree.toJSON();
        return JSON.stringify(json);
    }

    return Exporter;
})