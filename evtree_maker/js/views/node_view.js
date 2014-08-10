define(["baseView", "node", "branchView"], function (BaseView, Node, BranchView) {
    var SELECTED_RADIUS = 12;
    var SELECTED_FILL_COLOR = "#A80000";

    var NodeView = BaseView.extend({
        classname: "NodeView",
        events: {}
    });

    NodeView.prototype.template = new EJS({});

    NodeView.prototype.initialize = function (node, app) {
        this.node = node;
        this.app = app;

        if (this.node.get('type') === "BASE") {
            this.radius = 4;
            this.fillColor = "#CC9966";
        } else {
            this.radius = 6;
            this.fillColor = "#FFFF00";
        }

        this.render();
        this.listenToModelEvents();
        this.ifBaseCreateTop();
    };

    NodeView.prototype.listenToModelEvents = function () {
        if (this.node.get('parent')) {
            this.listenTo(this.node.get('parent'), 'change:x', this.updateX.bind(this));
        }
        this.listenTo(this.node, 'change:x', this.render.bind(this));
        this.listenTo(this.node, 'update', this.render.bind(this));
        this.listenTo(this.node, 'front', this.toFront.bind(this));
        this.listenTo(this.node, 'back', this.toBack.bind(this));
        this.listenTo(this.node, 'selected', this.nodeSelected.bind(this));
        this.listenTo(this.node, 'unselected', this.nodeUnselected.bind(this));
        this.listenTo(this.node.get('children'), 'add', this.addChild.bind(this));
    };

    NodeView.prototype.updateX = function () {
        var dx = this.node.get('parent').get('x') - this.node.get('parent').previous('x');
        this.node.set({
            x: this.node.get('x') + dx
        });
    };

    NodeView.prototype.render = function () {
        this.renderHtml();
        this.renderNode();
    };

    NodeView.prototype.renderHtml = function () {};

    NodeView.prototype.renderNode = function () {
        if (!this.element) {
            this.element = this.drawElement();
        }
        this.updateElement();
    };

    NodeView.prototype.ifBaseCreateTop = function () {
        if (this.node.get('type') === "BASE") {
            var node = new Node({
                x: this.node.get('x'),
                y: this.node.get('y') - 50,
                type: "TOP",
                parent: this.node
            });

            this.node.addChild(node);
        }
    };

    NodeView.prototype.drawElement = function () {
        var node = this.app.Paper.circle();
        node.hover(this.onMouseOver.bind(this), this.onMouseOut.bind(this));
        node.drag(this.onDragMove.bind(this), this.onDragStart.bind(this), this.onDragEnd.bind(this));
        node.click(this.onMouseClick.bind(this));
        return node;
    };

    NodeView.prototype.updateElement = function () {
        this.element.attr({
            cx: this.node.get('x'),
            cy: this.node.get('y'),
            r: this.radius,
            fill: this.fillColor
        });
    };

    NodeView.prototype.onMouseOver = function () {};

    NodeView.prototype.onMouseOut = function () {};

    NodeView.prototype.onDragStart = function () {};

    NodeView.prototype.onDragMove = function (dx, dy, x, y, evt) {
        this.node.set({
            y: evt.offsetY,
        });

        this.node.update();
    };

    NodeView.prototype.onDragEnd = function () {
        this.node.root().rearrange();
    };

    NodeView.prototype.onMouseClick = function () {
        if (this.app.CurrentNode) {
            this.app.CurrentNode.triggerUnselected();
        }
        this.app.CurrentNode = this.node;
        this.app.CurrentNode.triggerSelected();
    };

    NodeView.prototype.nodeSelected = function () {
        this.element.attr({
            r: SELECTED_RADIUS,
            fill: SELECTED_FILL_COLOR
        })
    };

    NodeView.prototype.nodeUnselected = function () {
        this.element.attr({
            r: this.radius,
            fill: this.fillColor
        })
    };

    NodeView.prototype.addChild = function (child) {
        var childNodeView = new NodeView(child, this.app);
        var branchView = new BranchView(this.node, child, this.app);
    };

    NodeView.prototype.toFront = function () {
        this.element.toFront();
    };

    NodeView.prototype.toBack = function () {
        this.element.toBack();
    };

    return NodeView;

})