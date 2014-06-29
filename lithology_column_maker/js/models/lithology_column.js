define(["baseModel", "lithologyMarkers", "lithologys", "lithologyGroups", "lithologyGroupMarkers", "settings",
    "polygons"
], function (BaseModel, LithologyMarkers, Lithologys, LithologyGroups, LithologyGroupMarkers, Settings, Polygons) {

    var LithologyColumn = BaseModel.extend({
        classname: "LithologyColumn",
        constructor: function (params) {
            var attrs = [{
                x: params.x || 0,
                id: _.uniqueId("column-"),
                name: params.name || _.uniqueId("Column "),
                width: parseInt(params.width) || 400,
                description: params.description || null,
                lithologyMarkers: new LithologyMarkers(),
                lithologys: new Lithologys(),
                lithologyGroupMarkers: new LithologyGroupMarkers(),
                lithologyGroups: new LithologyGroups(),
                settings: new Settings(),
                polygon: null,
                point: null,
                lat: null,
                lon: null,
            }];
            BaseModel.apply(this, attrs);
        }
    });

    LithologyColumn.prototype.comparator = function (lithologyColumn) {
        return lithologyColumn.get('x');
    }

    LithologyColumn.prototype.toJSON = function () {
        var json = _.clone(this.attributes);
        delete json["lithologys"];
        delete json["lithologyMarkers"];
        return json;
    }

    LithologyColumn.prototype.getLithologyForAge = function (age) {
        var lith = null;
        this.get('lithologys').each(function (lithology) {
            if (lithology.get('top').get('age') < age && lithology.get('base').get('age') > age) {
                lith = lithology;
            }
        });

        return lith;
    }

    return LithologyColumn;

});