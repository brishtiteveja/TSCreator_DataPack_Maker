define(["baseView", "node", "evTree", "nodeView"], function (BaseView, Node, EvTree, NodeView) {
    var EvTreeView = BaseView.extend({
        classname: 'EvTreeView',
        events: {}
    });

    EvTreeView.prototype.template = new EJS({});

    EvTreeView.prototype.initialize = function (app) {
        this.app = app;
        this.app.CurrentNode = null;
        this.evTree = new EvTree({
            name: "Evolution Tree"
        });

        this.listenToActionEvent();
    };

    EvTreeView.prototype.listenToActionEvent = function () {
        $("#canvas").bind('dblclick', this.createRootNode.bind(this));

        this.listenTo(this.evTree.get('roots'), 'add', this.addRoot.bind(this));
    };

    EvTreeView.prototype.renderHtml = function () {};

    EvTreeView.prototype.toggleEvTreeForm = function () {}

    EvTreeView.prototype.toggleEditStatus = function () {}


    EvTreeView.prototype.onMouseOver = function () {};

    EvTreeView.prototype.onMouseOut = function () {};

    EvTreeView.prototype.updateEvTree = function (evt) {
        if (evt.keyCode == TimescaleApp.ENTER || evt.keyCode == TimescaleApp.ESC) {}
    }

    EvTreeView.prototype.delete = function () {}

    EvTreeView.prototype.createRootNode = function (evt) {
        if (this.app.CurrentNode) {
            if (this.app.CurrentNode.get('type') === "TOP") {
                this.app.CurrentNode.addChild(new Node({
                    name: _.unique("Root "),
                    x: evt.offsetX,
                    y: evt.offsetY,
                    parent: this.app.CurrentNode,
                    type: "BASE"
                }));
            }
        } else {
            this.evTree.get('roots').add(new Node({
                name: _.unique("Root "),
                x: evt.offsetX,
                y: evt.offsetY,
                type: "BASE"
            }));
        }
    };

    EvTreeView.prototype.addRoot = function (node) {
        var nodeView = new NodeView(node, this.app);
    };

    return EvTreeView;
});