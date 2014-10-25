define([
    "zone",
    "marker",
    "node"
], function (Zone, Marker, Node) {

    var Loader = function (app) {
        this.app = app;
        this.zones = this.app.ZonesCollection;
        this.markers = this.app.MarkersCollection;
        this.evTree = this.app.evTree;
    };

    Loader.prototype.reset = function () {
        this.markers.reset();
        this.zones.reset();
        this.evTree.get('roots').reset();
    };

    Loader.prototype.loadTextData = function (data) {
        this.reset();
        this.parseMinAndMaxAgesAndAddMarkers(data);
        this.parseColumnData(data);
    };

    Loader.prototype.parseMinAndMaxAgesAndAddMarkers = function (data) {
        this.minAge = Infinity;
        this.maxAge = 0;
        var lines = data.split(/\r|\n/);
        var rangeColumn = null;
        for (var i in lines) {
            var line = lines[i].split("\t");
            if (line.length > 1) {
                if (line[1].toLowerCase() === "range") {
                    rangeColumn = true;
                } else {
                    if (rangeColumn) {
                        if (line.length > 2 && line[2].length > 0) {
                            this.minAge = parseFloat(line[2]) < this.minAge ? parseFloat(line[2]) : this.minAge;
                            this.maxAge = parseFloat(line[2]) > this.maxAge ? parseFloat(line[2]) : this.maxAge;
                        }
                    }
                }
            } else {
                rangeColumn = false;
            }
        }

        this.topAge = parseInt(this.minAge);
        var topMarker = new Marker({
            y: 50,
            age: this.topAge
        });

        this.markers.add(topMarker);

        this.baseAge = parseInt(this.maxAge) + 1;

        var baseMarker = new Marker({
            y: this.getYFromAge(this.baseAge),
            age: this.baseAge
        });

        this.markers.add(baseMarker);
    };

    Loader.prototype.getYFromAge = function (age) {
        return 50 + Math.round((age - this.topAge) * 5); // 30 pixes per million years
    };

    Loader.prototype.parseColumnData = function (data) {
        var self = this;
        var lines = data.split(/\r|\n/);
        var isRangeColumn = false;
        var tree = {};
        for (var i in lines) {
            var line = lines[i].split("\t");
            if (line.length > 1) {
                if (line[1].toLowerCase() === "range") {
                    isRangeColumn = true;
                    self.evTree.set({
                        name: line[0]
                    });
                } else {
                    if (isRangeColumn && line.length > 1) {
                        var img = line[1].match(/<img .*>/g);
                        var name = line[1].replace(/<img .*>/g, "").trim();
                        var age = parseFloat(line[2]);
                        var branch = null;
                        var style = null;
                        var description = null;
                        var color = null;
                        var category = null;
                        var type = null;
                        if (line.length > 3) {
                            type = line[3].trim().toLowerCase();
                            if (type === "branch") {
                                branch = line[4];
                            }

                            if (type === "branch") {
                                description = line[8];
                            } else {
                                description = line[4];
                            }

                            if (line[5]) {

                            }

                            if (line[6]) {
                                category = line[6];
                            }

                            if (line[7]) {
                                style = line[7];
                            }

                            if (line[9]) {
                                color = window.TscToCssColor(line[9]);
                            }
                        }
                        if (img) {
                            // TODO - Add image support.
                            // console.log($(img[0]).attr('src'));
                        }
                        if (branch) {
                            tree[name].branches.push({
                                age: age,
                                name: branch,
                                style: style,
                                description: description,
                                color: color,
                                rangeType: type,
                                category: category
                            });
                        } else {
                            if (!tree[name]) {
                                tree[name] = {
                                    base: parseFloat(age),
                                    top: null,
                                    name: name,
                                    branches: [],
                                    rangeType: type,
                                    description: description
                                };
                            } else {
                                tree[name].top = age;
                                if (tree[name].top > tree[name].base) {
                                    tree[name].top = tree[name].base;
                                    tree[name].base = age;
                                }
                                tree[name].top_description = description;
                            }
                        }

                    }
                }
            } else {
                isRangeColumn = false;
            }
        }


        this.condenseTreeObj(tree);

        var root = null;
        var startX = 50;
        for (var subtree in tree) {
            if (root) {
                startX = root.last().get('x') + startX;
            }
            root = this.generateTree(tree[subtree], null, startX);
        }
    };

    Loader.prototype.condenseTreeObj = function (tree) {
        for (var name in tree) {
            this.condense(name, tree);
        }
    };

    Loader.prototype.condense = function (name, tree) {
        var node = tree[name];
        if (node && node.branches.length > 0) {
            for (var i = 0; i < node.branches.length; i++) {
                this.mergeJSON(node.branches[i], this.condense(node.branches[i].name, tree));
                delete tree[node.branches[i].name];
            }
        }
        return node;
    };

    Loader.prototype.generateTree = function (subtree, parent, startX) {
        if (!subtree.branches) {
            return;
        }
        var locationY = 0;

        if (subtree.age && parent) {
            locationY = this.getYFromAge(subtree.age);
            var node = new Node({
                name: subtree.name,
                x: startX,
                y: locationY,
                type: "TOP",
                parent: parent,
                description: subtree.description,
                style: subtree.style,
                category: subtree.category,
                rangeType: subtree.rangeType
            });
            parent.get('children').add(node);
            parent = node;
        }

        locationY = this.getYFromAge(subtree.base);
        var base = new Node({
            name: subtree.name,
            x: startX,
            y: locationY,
            type: "BASE",
            parent: parent,
            style: subtree.style,
            color: subtree.color,
            description: subtree.description,
            category: subtree.category,
            rangeType: subtree.rangeType
        });

        if (parent) {
            parent.get('children').add(base);
        } else {
            this.evTree.get('roots').add(base);
        }

        locationY = this.getYFromAge(subtree.top);
        var top = new Node({
            name: subtree.name,
            x: startX,
            y: locationY,
            type: "TOP",
            parent: base,
            color: subtree.color,
            style: subtree.style,
            description: subtree.top_description,
            category: subtree.category,
            rangeType: subtree.rangeType
        });
        base.get('children').add(top);
        var length = subtree.branches.length;
        for (var index = 0; index < length; index++) {
            this.generateTree(subtree.branches[index], base, startX);
        }
        base.root().rearrange();
        return base.root();
    };

    Loader.prototype.mergeJSON = function (j1, j2) {
        for (var key in j2) {
            j1[key] = j2[key];
        }
    };

    return Loader;
});