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
            debugger;
            var percent = Math.round(zone.getRelativeY(this.get('y'))*1000)/10;
            var age = zone.getAbsoluteAge(this.get('y'));
            return age + " myr, " + percent + "% up " + zone.get('name')
        }
        return this.get('y');
    };

    return TimeLine;
});