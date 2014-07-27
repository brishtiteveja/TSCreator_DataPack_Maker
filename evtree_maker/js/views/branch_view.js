define(["baseView", "node", "raphael"], function (BaseView, Node, Raphael) {
    STROKE_WIDTH = 2;

    var BranchView = BaseView.extend({
        classname: "BaseView",
        events: {}
    });

    BranchView.prototype.initialize = function (parentNode, childNode, app) {
        this.parentNode = parentNode;
        this.childNode = childNode;
        this.app = app;

        this.renderBranch();
        this.listenToEvents();
    };

    BranchView.prototype.listenToEvents = function () {
        this.listenTo(this.parentNode, "update", this.renderBranch.bind(this));
        this.listenTo(this.childNode, "update", this.renderBranch.bind(this));
    };

    BranchView.prototype.renderBranch = function () {
        if (!this.element) {
            this.element = this.app.Paper.path();
            this.parentNode.toFront();
            this.childNode.toFront();
        }

        this.element.attr({
            'path': this.getCurvePath(),
            'stroke-width': STROKE_WIDTH
        });
    };

    BranchView.prototype.getCurvePath = function () {

        var midPointX = (this.parentNode.get('x') + this.childNode.get('x')) / 2;
        var midPointY = (this.parentNode.get('y') + this.childNode.get('y')) / 2;

        var point1X = this.parentNode.get('x');
        // var point1Y = (this.parentNode.get('y') + midPointY) / 2;
        var point1Y = midPointY;

        var point2X = this.childNode.get('x');
        // var point2Y = (midPointY + this.childNode.get('y')) / 2;
        var point2Y = midPointY;

        var pathStr = "M" + this.parentNode.get('x') + "," + this.parentNode.get('y') +
            "C" + point1X + "," + point1Y +
            "," + point2X + "," + point2Y +
            "," + this.childNode.get('x') + "," + this.childNode.get('y');
        return pathStr;
    };

    return BranchView;
});