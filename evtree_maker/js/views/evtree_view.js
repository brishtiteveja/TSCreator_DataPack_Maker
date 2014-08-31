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
        $("#canvas").bind("dblclick", this.createRootNode.bind(this));

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
        if (!this.enableTreeMode) {
            return;
        };

        var cdts = ViewboxToPaper(this.app, evt.offsetX, evt.offsetY);
        var locationX = cdts.x;
        var locationY = cdts.y;
        var zone = this.app.ZonesCollection.getZoneForY(locationY);

        if (!zone) {
            return;
        }

        if (this.app.CurrentNode) {
            if (this.app.CurrentNode.get('type') === "TOP") {
                if (locationY >= this.app.CurrentNode.get('y')) {
                    return;
                }

                var node = new Node({
                    name: _.unique("Root "),
                    x: locationX,
                    y: locationY,
                    parent: this.app.CurrentNode,
                    type: "BASE"
                });
                this.app.CurrentNode.addChild(node);
                this.app.CurrentNode.root().rearrange();
            }
        } else {
            this.evTree.get('roots').add(new Node({
                name: _.unique("Root "),
                x: locationX,
                y: locationY,
                type: "BASE"
            }));
        }
    };

    EvTreeView.prototype.addRoot = function (node) {
        var nodeView = new NodeView(node, this.app);
    };

    EvTreeView.prototype.enable = function () {
        $("a[href='#tree-mode']").parent().addClass('active');
        this.enableTreeMode = true;
    };

    EvTreeView.prototype.disable = function () {
        $("a[href='#tree-mode']").parent().removeClass('active');
        this.enableTreeMode = false;
    };

    return EvTreeView;
});