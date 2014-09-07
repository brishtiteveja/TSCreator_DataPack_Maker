define([
    "zone",
    "marker",
], function (Zone, Marker) {

    var Loader = function (app) {
        this.app = app;
        this.zones = this.app.ZonesCollection;
        this.markers = this.app.MarkersCollection;
        this.evTree = this.app.evTree;
    }

    Loader.prototype.reset = function () {
        this.markers.reset();
        this.zones.reset();
        this.evTree.get('roots').reset();
    }

    Loader.prototype.loadTextData = function (data) {
        this.reset();
        this.parseMinAndMaxAgesAndAddMarkers(data);
        this.parseColumnData(data);
    };

    Loader.prototype.parseMinAndMaxAgesAndAddMarkers = function (data) {
        var self = this;
        this.minAge = Infinity;
        this.maxAge = 0;
        var lines = data.split(/\r|\n/);
        var rangeColumn = null;
        var rangeColumnTextData = [];
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
                rangeColumn = false
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
    }

    Loader.prototype.getYFromAge = function (age) {
        return 50 + Math.round((age - this.topAge) * 30); // 30 pixes per million years
    }

    Loader.prototype.parseColumnData = function (data) {
        var self = this;
        var lines = data.split(/\r|\n/);
        var node = null;
        var isRangeColumn = false;
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
                        var age = line[2];
                        var branch = null;
                        if (line.length > 3) {
                            var type = line[3].trim().toLowerCase();
                            if (type === "branch") {
                                branch = line[4];
                            }
                        }
                        if (img) {
                            // console.log($(img[0]).attr('src'));
                        }
                        console.log(name + " " + branch + " " + age);

                    }
                }
            } else {
                isRangeColumn = false;
            }
        }
    };


    return Loader;
});