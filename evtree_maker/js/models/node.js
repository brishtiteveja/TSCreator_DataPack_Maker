define(["baseModel", "nodes"], function (BaseModel, Nodes) {
    var Node = BaseModel.extend({
        classname: "Node",
        constructor: function (params) {
            var attrs = [{
                name: params.name || _.uniqueId("Node "),
                age: params.age || null,
                x: params.x || null,
                y: params.y || null,
                parent: params.parent || null,
                children: new Nodes(),
                type: params.type || "BASE",
                depth: 1,
                width: 0,
                height: 0
            }];
            BaseModel.apply(this, attrs);
        }
    });

    Node.prototype.children = function () {
        return this.get('children');
    };

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

    Node.prototype.depth = function () {
        var depth = 0;
        this.get('children').each(function (child) {
            depth = Math.max(depth, child.depth());
        });

        return (depth + 1);
    };

    Node.prototype.first = function () {
        if (this.children().left()) {
            return this.children().left().first();
        } else {
            return this;
        }
    };

    Node.prototype.last = function () {
        if (this.children().right()) {
            return this.children().right().last();
        } else {
            return this;
        }
    };

    Node.prototype.parent = function () {
        return this.get('parent');
    };

    Node.prototype.before = function () {
        var parent = this.parent();
        var node = this;
        var index = parent.children().indexOf(node)
        while (parent && index == 0) {
            node = parent
            parent = parent.parent();
            index = parent.indexOf(node);
        }
        return parent.children().at(index - 1).last();
    };

    Node.prototype.after = function () {
        var parent = this.parent();
        var node = this;
        var index = parent.children().indexOf(node);
        var size = parent.children().size();
        while (parent && index == size - 1) {
            node = parent
            parent = parent.parent();
            index = parent.indexOf(node);
        }
        return parent.children().at(index + 1).first();
    };

    Node.prototype.rearrange = function () {

        var parent = this.get('parent');
        var children = this.get('children');
        var size = children.size();

        this.get('children').each(function (child) {
            child.rearrange();
        });

        if (!parent) {
            return;
        }

        for (var i = 0; i < size; i++) {
            var child = children.at(i)
            if (i == 0) {
                child.set({
                    x: this.get('x')
                })
            } else {
                var x = child.before().get('x');
                child.set({
                    x: x + 30
                })
            }
        }
    };


    Node.prototype.depthify = function () {
        this.set({
            depth: this.depth()
        });
        this.get('parent').reDepthify();
    };

    Node.prototype.root = function () {
        if (!this.get('parent')) {
            return this;
        }
        return this.get('parent').root();
    };

    return Node;
});