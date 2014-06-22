define(["baseModel"], function (BaseModel) {
    window.tscApp = window.tscApp || {};

    window.tscApp.Scheme = {
        TIMELINES: 1,
        RULER: 2
    }

    var DefaultOb = BaseModel.extend({
        constructor: function (params, options) {
            var attrs = [{
                top: params.top || 0,
                base: params.base || 0,
                scheme: params.scheme || tscApp.Scheme.TIMELINES,
                units: params.units || "myr",
                pixPerUnit: params.pixPerUnit || 10,
                verticalScale: params.verticalScale || 1,
            }];
            BaseModel.apply(this, attrs);
        }
    });

    return DefaultOb;
});