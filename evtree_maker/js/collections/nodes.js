define(["baseCollection", "node"], function (BaseCollection, Node) {

    var Nodes = BaseCollection.extend({
        classname: "Nodes",
        model: Node
    });

    Nodes.prototype.comparator = function (node) {
        return node.get('y');
    };

    Nodes.prototype.left = function () {
        var left = null;

        this.each(function (child) {
            left = left && left.get('x') < child.get('x') ? left : child;
        });
        return left;
    };

    Nodes.prototype.right = function () {
        var right = null;

        this.each(function (child) {
            right = right && right.get('x') > child.get('x') ? right : child;
        });
        return right;
    };

    return Nodes;
});