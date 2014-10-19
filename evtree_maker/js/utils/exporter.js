define([], function () {

    var Exporter = function (app) {
        this.app = app;
    };

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
        json.zones = this.zones.toJSON();
        json.evTree = this.evTree.toJSON();
        return JSON.stringify(json);
    };

    Exporter.prototype.getText = function () {
        var self = this;
        var outputText = "\n\n";
        this.evTree.get('roots').each(function (root) {
            outputText += self.getNodeText(root);
        });
        return outputText;
    };

    Exporter.prototype.getNodeText = function (node) {
        var self = this;
        var outputText = "\t" + node.get('name') + "\t" + node.get('age') + "\t" + node.get('rangeType') + "\n";
        node.children().each(function (child) {
            outputText += "\t" + node.get('name') + "\t" + child.get('age') + "\t" + node.get('rangeType') +
                "\t" + child.get('name') +
                "\t\t\t" + child.get('style') + "\n";
        });
        node.children().each(function (child) {
            outputText += self.getNodeText(child);
        });
        return outputText;
    };

    return Exporter;
});