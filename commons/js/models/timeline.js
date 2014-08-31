define(["baseModel"], function (BaseModel) {
    var TimeLine = BaseModel.extend({
        constructor: function (params, app) {
            params = params || {};
            var attrs = [{
                y: params.y || 0,
                age: params.age || 0
            }];
            this.app = app;
            BaseModel.apply(this, attrs);
        }
    });

    TimeLine.prototype.getLabel = function() {
        var zone = this.app.ZonesCollection.getZoneForY(this.get('y'));
        if (zone) {
            var relativeY = zone.getRelativeY(this.get('y'));
            return zone.get('name') + "(" + relativeY + ")"
        }
        return this.get('y');
    };

    return TimeLine;
});