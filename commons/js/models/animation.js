define(["baseModel"], function (BaseModel) {
    var Animation = BaseModel.extend({
        constructor: function (params, options) {
            var attrs = [{
                age: params.age || 0,
                top: params.top || 0,
                base: params.base || 0,
                step: params.step || 2,
            }];
            BaseModel.apply(this, attrs);
        }
    });

    return Animation;
});