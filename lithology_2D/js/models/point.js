define(["baseModel"], function (BaseModel) {
    var Point = BaseModel.extend({
        classname: "Point",
        constructor: function (params, app) {
            var attrs = [{
                edit: false,
                name: params.name || _.uniqueId("X"),
                x: params.x ? parseInt(params.x) : 0,
                y: params.y ? parseInt(params.y) : 0,
                lat: params.lat || 0,
                lon: params.lon || 0,
                app: app
            }];
            BaseModel.apply(this, attrs);
        }
    });

    Point.prototype.toJSON = function () {
        var json = _.clone(this.attributes);
        delete json["app"];
        return json;
    }

    return Point;
});