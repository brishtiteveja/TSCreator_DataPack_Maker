define(["baseModel", "nodes"], function (BaseModel, Nodes) {
    var NODE_SEPARATION = 100;
    var Node = BaseModel.extend({
        classname: "Node",
        constructor: function (params) {
            var id = _.uniqueId("n");
            var attrs = [{
                id: params.id || id,
                name: params.name || "Range " + id,
                age: params.age || null,
                x: params.x || null,
                y: params.y || null,
				rangelabel: null,
				labelPadX: 20,
				labelPadY: 30,
                parent: params.parent || null,
                children: new Nodes(),
                type: params.type || "BASE",
                depth: 1,
                width: 0,
                height: 0,
                zone: null,
                style: params.style || "default",
                description: params.description || "",
                color: params.color || null,
                frequency: params.frequency || null,
                rangeType: params.rangeType || "frequent",
                image: null
            }];
            BaseModel.apply(this, attrs);
        }
    });

    Node.prototype.toJSON = function () {
        var json = _.clone(this.attributes);
        delete json.parent;
        if (json.image) {
            json.image = json.image.name;
        }
        return json;
    };

    Node.prototype.isRoot = function () {
        return (this.root() === this);
    };

    Node.prototype.children = function () {
        return this.get("children");
    };

    Node.prototype.getBase = function () {
        var base = null;
        if (this.get('type') === "TOP") {
            return null;
        }
        this.get("children").each(function (node) {
            if (node.get('TOP')) {
                base = base && base.get('y') > node.get('y') ? base : node;
            }
        });
        return base;
    };

    Node.prototype.triggerSelected = function () {
        this.trigger("selected");
    };

    Node.prototype.triggerUnselected = function () {
        this.trigger("unselected");
    };

    Node.prototype.toFront = function () {
        this.trigger("front");
    };

    Node.prototype.toBack = function () {
        this.trigger("back");
    };

    Node.prototype.addChild = function (node) {
        this.get("children").add(node);
    };

    Node.prototype.depth = function () {
        var depth = 0;
        this.get("children").each(function (child) {
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
        return this.get("parent");
    };

    Node.prototype.before = function () {
        var parent = this.parent();
        var node = this;
        var index = parent.children().indexOf(node);
        while (parent && index === 0) {
            node = parent;
            var temp = node.parent();
            if (temp) {
                parent = temp;
                index = parent.children().indexOf(node);
            } else {
                break;
            }
        }

        if (index > 0) {
            return parent.children().at(index - 1).last();
        } else {
            return null;
        }
    };

    Node.prototype.before_max = function () {
        var node = this.before();
        var node_max = this.parent();
        while (node) {
            if (node.get("x") > node_max.get("x")) {
                node_max = node;
            }
            node = node.before();
        }
        return node_max;
    };

    Node.prototype.after = function () {
        var parent = this.parent();
        var node = this;
        var index = parent.children().indexOf(node);
        var size = parent.children().size();
        while (parent && index == size - 1) {
            node = parent;
            parent = parent.parent();
            index = parent.children().indexOf(node);
            size = parent.children().size();
        }
        return parent.children().at(index + 1).first();
    };

    Node.prototype.rearrange = function () {

//        this.children().sort();
//
//        var children = this.get("children");
//        var size = children.size();
//
//        this.get("children").each(function (child) {
//            child.rearrange();
//        });
//
//        for (var i = 0; i < size; i++) {
//            var child = children.at(i);
//            if (child.get("type") === "TOP") {
//                child.set({
//                    x: this.get("x")
//                });
//            } else {
//                var node_before = child.before_max();
//                var x = node_before.get("x");
//                child.set({
//                    x: x + NODE_SEPARATION
//                });
//            }
//        }
    };


    Node.prototype.depthify = function () {
        this.set({
            depth: this.depth()
        });
        this.get("parent").reDepthify();
    };

    Node.prototype.root = function () {
        if (!this.get("parent")) {
            return this;
        }
        return this.get("parent").root();
    };

    Node.prototype.getImageURL = function () {
        if (this.get("image")) {
            return "filesystem:http://" + window.location.host + "/persistent" + this.get('image').fullPath;
        } else {
            return null;
        }
    };

    Node.prototype.getMaxYChild = function () {
        return this.children().max(function (child) {
            return child.get("y");
        });
    };

    Node.prototype.getChildNodes = function(array) {
        var self = this;
        array = array || [];
        self.children().each(function (child) {
            array.push(child);
            child.getChildNodes(array);
        });
        return array;
    };


    return Node;
});
