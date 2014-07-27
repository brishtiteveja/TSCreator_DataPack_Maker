define(["baseModel", "nodes"], function (BaseModel, Nodes) {
    var Branch = BaseModel.extend({
        classname: "Branch",
        constructor: function (params) {
            var attrs = [{
                name: params.name || _.uniqueId("Branch "),
                age: params.age || null,
                x: params.x || null,
                y: params.y || null,
                parent: null,
                children: new Nodes(),
                type: params.type || "BASE"
            }];
            BaseModel.apply(this, attrs);
        }
    });

    Branch.prototype.triggerSelected = function () {
        this.trigger('selected');
    };

    Branch.prototype.triggerUnselected = function () {
        this.trigger('unselected');
    };

    Branch.prototype.addChild = function (node) {
        this.get('children').add(node);
    };

    return Branch;
});