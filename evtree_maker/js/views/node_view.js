window.define([
    "baseView",
    "node",
    "branchView",
    "nodeEditorView"
], function (
    BaseView,
    Node,
    BranchView,
    NodeEditorView) {
    var SELECTED_RADIUS = 12;
    var SELECTED_FILL_COLOR = "#A80000";
    var DRAGOVER_RADIUS = 30;

    var NodeView = BaseView.extend({
        tagName: "li",
        classname: "NodeView",
        events: {}
    });

    NodeView.prototype.template = new EJS({
        url: "/evtree_maker/ejs/node.ejs"
    });

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

        this.id = this.node.get('id');

        this.$el.append('<div class="row"></div>');
        this.render();
        this.listenToModelEvents();
        // this.ifBaseCreateTop();
    };

    NodeView.prototype.listenToModelEvents = function () {
        if (this.node.get('parent')) {
            this.listenTo(this.node.get('parent'), 'change:x', this.updateX);
        }
        this.listenTo(this.node, 'change:x', this.render);
        this.listenTo(this.node, 'change:image', this.render);
        this.listenTo(this.node, 'update', this.render);
        this.listenTo(this.node, 'front', this.toFront);
        this.listenTo(this.node, 'back', this.toBack);
        this.listenTo(this.node, 'selected', this.nodeSelected);
        this.listenTo(this.node, 'unselected', this.nodeUnselected);
        this.listenTo(this.node, 'write-completed', this.imageLoaded);
        this.listenTo(this.node.get('children'), 'add', this.addChild);
        this.listenTo(this.node, 'delete', this.delete);
        this.listenTo(this.node, 'destroy', this.removeElements);
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
        this.renderToottip();
    };

    NodeView.prototype.renderHtml = function () {
        if (!this.element) {
            $("#evtrees-list>.data-list").append(this.template.render(this.node.toJSON()));
        } else {
            $("#" + this.node.id).replaceWith(this.template.render(this.node.toJSON()));
        }
    };

    NodeView.prototype.renderNode = function () {
        if (!this.element) {
            this.element = this.drawElement();
            this.element.dblclick(this.showEditor.bind(this));
        }
        this.updateZone();
        this.updateElement();
    };

    NodeView.prototype.renderToottip = function () {
        var content = this.node.get('name') + "<br/>";
        content += "Style: " + this.node.get('style') + "<br/>";
        if (this.node.get('zone')) {
            content += this.node.get('zone').get('name') + "(" + this.node.get('age') + ")" + "<br/>";
            content += this.node.get('description') + "<br/>";
            if (this.node.get('image')) {
                content += '<img src="' + this.node.getImageURL() + '">';
            }
        }
        var self = this;

        if (self.qTip) {
            self.qTip.remove();
        }

        $(this.element.node).qtip({
            content: {
                text: content
            },
            position: {
                my: 'bottom left', // Position my top left...
                target: 'mouse', // my target
                adjust: {
                    x: 10,
                    y: -10
                }
            },
            events: {
                render: function () {
                    self.qTip = this;
                }
            }
        });
    };

    NodeView.prototype.updateZone = function () {
        var zone = this.app.ZonesCollection.getZoneForY(this.node.get('y'));
        if (zone) {
            var relativeY = zone.getRelativeY(this.node.get('y'));
            var age = zone.getAbsoluteAge(this.node.get('y'));
            this.node.set({
                zone: zone,
                relativeY: relativeY,
                age: age
            }, {
                silent: true
            });
        }
    };

    NodeView.prototype.ifBaseCreateTop = function () {
        if (this.node.get('type') === "BASE") {
            var name = this.node.isRoot() ? "Root Top" : "Top";
            var node = new Node({
                name: name,
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
        node.node.id = _.uniqueId("node-");
        $("#" + node.node.id).on('dragover', this.onDragOver.bind(this));
        $("#" + node.node.id).on('drop', this.onDrop.bind(this));
        node.click(this.onMouseClick.bind(this));
        return node;
    };

    NodeView.prototype.updateElement = function () {
        var fill = this.fillColor;
        var image = this.node.getImageURL();
        if (image) {
            if (!this.image) {
                this.image = this.app.Paper.image(image, this.node.get('x'), this.node.get('y') + 10, 42, 42);
            } else {
                this.image.attr({
                    src: image,
                    x: this.node.get('x'),
                    y: this.node.get('y') + 10
                });
            }
            this.image.toBack();
        }

        this.element.attr({
            cx: this.node.get('x'),
            cy: this.node.get('y'),
            r: this.radius,
            fill: fill,
        });
    };

    NodeView.prototype.onDragStart = function () {};

    NodeView.prototype.onDragMove = function (dx, dy, x, y, evt) {
        var cdts = ViewboxToPaper(this.app, evt.offsetX, evt.offsetY);
        var locationX = cdts.x;
        var locationY = cdts.y;
        var zone = this.app.ZonesCollection.getZoneForY(locationY);
        if (!zone) {
            return;
        }

        if (this.node.children().length > 0 && locationY < this.node.getMaxYChild().get('y')) {
            return;
        }
        if (this.node.get('parent') && locationY > this.node.get('parent').get('y')) {
            return;
        }
        this.node.set({
            y: locationY,
        });

        this.node.update();
    };

    NodeView.prototype.onDragEnd = function () {
        this.node.root().rearrange();
    };

    NodeView.prototype.onMouseOver = function () {
        this.element.attr({
            r: SELECTED_RADIUS
        });
    };

    NodeView.prototype.onMouseOut = function () {
        if (this.selected) {
            this.element.attr({
                r: SELECTED_RADIUS
            });
        } else {
            this.element.attr({
                r: this.radius
            });
        }
    };

    NodeView.prototype.onMouseClick = function () {
        if (this.app.CurrentNode) {
            this.app.CurrentNode.triggerUnselected();
        }
        this.app.CurrentNode = this.node;
        this.app.CurrentNode.triggerSelected();
    };

    NodeView.prototype.nodeSelected = function () {
        this.selected = true;
        this.element.attr({
            r: SELECTED_RADIUS,
            fill: SELECTED_FILL_COLOR
        });
    };

    NodeView.prototype.nodeUnselected = function () {
        this.selected = false;
        this.element.attr({
            r: this.radius,
            fill: this.fillColor
        });
    };

    NodeView.prototype.addChild = function (child) {
        var childNodeView = new NodeView(child, this.app);
        var rootId = this.node.root().get('id');
        if (this.node.isRoot()) {
            this.$el.append(childNodeView.el);
        } else {
            $("#" + rootId).append(childNodeView.el);
        }
        new BranchView(this.node, child, this.app);
    };

    NodeView.prototype.toFront = function () {
        this.element.toFront();
    };

    NodeView.prototype.toBack = function () {
        this.element.toBack();
    };

    NodeView.prototype.onDragOver = function (evt) {
        evt = evt.originalEvent;
        evt.stopPropagation();
        evt.preventDefault();
        this.element.attr({
            r: DRAGOVER_RADIUS
        });
    };

    NodeView.prototype.onDrop = function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        this.app.fileSystemView.saveFile(this.node, evt.originalEvent.dataTransfer.files[0]);
    };

    NodeView.prototype.imageLoaded = function (fileEntry) {
        this.node.set({
            image: fileEntry
        });
    };

    NodeView.prototype.showEditor = function () {
        if (!this.nodeEditorView) {
            this.nodeEditorView = new NodeEditorView(this.node);
        } else {
            this.nodeEditorView.render();
        }
    };

    NodeView.prototype.delete = function() {
        var childNodes = this.node.getChildNodes();
        for (var i=0; i<childNodes.length; i++) {
            childNodes[i].destroy();
        }
        this.node.destroy();
    };

    NodeView.prototype.removeElements = function() {
        $("#" + this.node.id).remove();
        if (this.element) this.element.remove();
        if (this.image) this.image.remove();
        if (this.label) this.label.remove();
    };

    return NodeView;

});
