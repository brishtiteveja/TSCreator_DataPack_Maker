define(["baseModel", "nodes"], function (BaseModel, Nodes) {
    var Node = BaseModel.extend({
        classname: "Node",
        constructor: function (params) {
            var attrs = [{
                name: params.name || _.uniqueId("Node "),
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

    Node.prototype.triggerSelected = function () {
        this.trigger('selected');
    };

    Node.prototype.triggerUnselected = function () {
        this.trigger('unselected');
    };

    Node.prototype.toFront = function () {
        this.trigger('front');
    };

    Node.prototype.toBack = function () {
        this.trigger('back');
    };

    Node.prototype.addChild = function (node) {
        this.get('children').add(node);
    };

    return Node;
});