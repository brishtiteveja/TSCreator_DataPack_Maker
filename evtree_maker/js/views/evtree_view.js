define(["baseView", "node", "evTree", "nodeView"], function (BaseView, Node, EvTree, NodeView) {
    var EvTreeView = BaseView.extend({
        el: "#evtrees-list",
        classname: 'EvTreeView',
        events: {}
    });

    EvTreeView.prototype.template = new EJS({
        url: '../../commons/ejs/data_tbl.ejs'
    });

    EvTreeView.prototype.initialize = function (app) {
        this.app = app;
        this.app.CurrentNode = null;

        this.app.evTree = new EvTree({
            name: "Evolution Tree"
        });

        this.evTree = this.app.evTree;

        this.listenToActionEvent();
        this.renderHtml();
    };

    EvTreeView.prototype.listenToActionEvent = function () {
        $("#canvas").bind("dblclick", this.createRootNode.bind(this));

        this.listenTo(this.evTree.get('roots'), 'add', this.addRoot.bind(this));
    };

    EvTreeView.prototype.renderHtml = function () {
        this.$el.html(this.template.render({
            name: "Evolution Trees"
        }))
    };

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
            window.alert("You need to draw at least two timelines before proceeding.");
            return;
        }

        if (this.app.MarkersCollection.hasUndefinedAges()) {
            window.alert("Please define ages for all the timelines before proceeding.");
            return;
        }

        if (this.app.CurrentNode) {
            var node;
            if (locationY >= this.app.CurrentNode.get('y')) {
                return;
            }

            if (this.app.CurrentNode.get('type') === "TOP") {
                node = new Node({
                    x: locationX,
                    y: locationY,
                    parent: this.app.CurrentNode,
                    type: "BASE"
                });
            } else {
                node = new Node({
                    x: locationX,
                    y: locationY,
                    parent: this.app.CurrentNode,
                    type: "TOP"
                });
            }
            if (locationY > this.app.CurrentNode.get('y') + 6 || locationY < this.app.CurrentNode.get('y') - 6) { // won't add a child node if within max radius = 6 units
            	this.app.CurrentNode.addChild(node);
            }
            this.app.CurrentNode.root().rearrange();
        } else {
            this.evTree.get('roots').add(new Node({
                name: "Root Base",
                x: locationX,
                y: locationY,
                type: "BASE"
            }));
        }
    };

    EvTreeView.prototype.addRoot = function (node) {
        new NodeView(node, this.app);
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
