define(["baseModel"], function (BaseModel) {
    var Map = BaseModel.extend({
        constructor: function (params, options) {
            var attrs = [{
                Layer: "nasa"
            }];
            BaseModel.apply(this, attrs);
        }
    });

    return Map;
})