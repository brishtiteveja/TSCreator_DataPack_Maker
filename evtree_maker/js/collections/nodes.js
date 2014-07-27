define(["baseCollection", "node"], function (BaseCollection, Node) {

    var Nodes = BaseCollection.extend({
        classname: "Nodes",
        model: Node
    });

    return Nodes;
});