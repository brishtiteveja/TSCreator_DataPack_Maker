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
        var outputText = "";

        if (node.get('type') === "BASE" || node.children().size() === 0) {
            outputText = "\t" + node.get('name') + "\t" + node.get('age') + "\t" + node.get('rangeType') + "\t" +
                node.get('description') + "\n";
        }

        node.children().each(function (child) {
            if (child.children().size() && child.get('type') === "TOP") {
                outputText += "\t" + node.get('name') + "\t" + child.get('age') + "\t" + "branch" +
                    "\t" + child.get('name') +
                    "\t\t\t" + (child.get('style') || "") + "\t" + child.get('description') + "\n";
            }
        });
        node.children().each(function (child) {
            outputText += self.getNodeText(child);
        });
        return outputText;
    };

    return Exporter;
});