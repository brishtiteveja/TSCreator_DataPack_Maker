define(["baseModel"], function (BaseModel) {
    var Map = BaseModel.extend({
        constructor: function (params, options) {
            var attrs = [{
                Layer: Map.Layer[0]
            }];
            BaseModel.apply(this, attrs);
        }
    });

    return Map;
})