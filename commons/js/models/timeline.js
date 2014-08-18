define(["baseModel"], function (BaseModel) {
    var TimeLine = BaseModel.extend({
        constructor: function (params) {
            params = params || {};
            var attrs = [{
                y: params.y || 0,
                age: params.age || 0
            }];
            BaseModel.apply(this, attrs);
        }
    });

    return TimeLine;
});