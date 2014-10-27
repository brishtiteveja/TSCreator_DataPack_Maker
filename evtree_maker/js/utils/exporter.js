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

    Exporter.prototype.getAllImages = function () {
        var self = this;
        var imagesList = [];
        this.evTree.get('roots').each(function (root) {
            self.getNodeImages(imagesList, root);
        });
        return imagesList;
    };

    Exporter.prototype.getNodeImages = function (imagesList, node) {
        var self = this;
        var image = node.get('image');
        if (image) {
            imagesList.push(image);
        }
        node.children().each(function (child) {
            self.getNodeImages(imagesList, child);
        });
    };


    Exporter.prototype.saveAllImages = function (saveFunc, callback) {
        var self = this;
        this.evTree.get('roots').each(function (root) {
            self.saveNodeImages(root, saveFunc);
        });
        callback();
    };

    Exporter.prototype.saveNodeImages = function (node, saveFunc) {
        var self = this;
        var image = node.get('image');
        if (image) {
            saveFunc(node, image);
        }
        node.children().each(function (child) {
            self.saveNodeImages(child, saveFunc);
        });
    };

    Exporter.prototype.getText = function () {
        var self = this;
        var date = new Date();
        var outputText = "format version:\t1.4\n\n";
        outputText += this.evTree.get('name') + "\trange\n";
        this.evTree.get('roots').each(function (root) {
            outputText += self.getNodeText(root);
        });
        return outputText;
    };

    Exporter.prototype.formatDescription = function (description) {
        var images = description.match(/<img [^>]*>/g);

        if (images) {
            for (var j = 0; j < images.length; j++) {
                var $image = $(images[j]);
                var src = $image.attr('src');
                $image.attr('src', src.split("/").pop(-1));
                description = description.replace(images[j], $image.get(0).outerHTML);
            }
        }

        return description;
    };

    Exporter.prototype.getNodeText = function (node) {
        var self = this;
        var outputText = "";
        var color = window.CssToTscColor(node.get('color') || "#000000");
        var description = node.get('description');

        if (description) {
            description = self.formatDescription(description);
        }
        var name = node.get('name');

        var image = node.get('image');

        // if (image) {
        //     name += ' <img src="' + image.name + '">';
        // }
        if (node.get('type') === "BASE" || node.children().size() === 0) {
            outputText = "\t" + name + "\t" + node.get('age') + "\t" + node.get('rangeType') + "\t" +
                description + "\n";
        }

        node.children().each(function (child) {
            description = child.get('description');
            if (description) {
                description = self.formatDescription(description);
            }
            if (child.children().size() && child.get('type') === "TOP") {
                outputText += "\t" + node.get('name') + "\t" + child.get('age') + "\t" + "branch" +
                    "\t" + child.get('name') +
                    "\t\t\t" + (child.get('style') || "") + "\t" + description + "\t" +
                    CssToTscColor(child.get('color') || "#000000") + "\n";
            }
        });
        node.children().each(function (child) {
            outputText += self.getNodeText(child);
        });
        return outputText;
    };

    return Exporter;
});