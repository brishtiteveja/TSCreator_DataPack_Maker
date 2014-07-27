define(["baseModel", "nodes"], function (BaseModel, Nodes) {
    var EvTree = BaseModel.extend({
        classname: "EvTree",
        constructor: function (params) {
            var attrs = [{
                name: params.name || _.uniqueId("Tree "),
                roots: new Nodes()
            }];
            BaseModel.apply(this, attrs);
        }
    });

    return EvTree;
});