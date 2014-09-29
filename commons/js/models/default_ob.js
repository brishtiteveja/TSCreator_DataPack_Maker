define(["baseModel"], function (BaseModel) {
    window.TimescaleApp = window.TimescaleApp || {};
    window.TimescaleApp.Scheme = {
        TIMELINES: 1,
        RULER: 2
    }

    var DefaultOb = BaseModel.extend({
        constructor: function (params, options) {
            var attrs = [{
                top: params.top || 0,
                base: params.base || 0,
                scheme: params.scheme || TimescaleApp.Scheme.TIMELINES,
                units: params.units || "myr",
                pixPerUnit: params.pixPerUnit || 10,
                verticalScale: params.verticalScale || 1,
            }];
            BaseModel.apply(this, attrs);
        }
    });

    DefaultOb.prototype.verticalScale = function () {
        return this.get('verticalScale') * this.get('pixPerUnit');
    };

    return DefaultOb;
});