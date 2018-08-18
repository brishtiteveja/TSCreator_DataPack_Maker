define(["baseView", "node", "raphael"], function (BaseView, Node, Raphael) {
    var STROKE_WIDTH = 2;
    var HOVER_STROKE_WIDTH = 5;

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
        this.listenTo(this.parentNode, "change:x", this.renderBranch);
        this.listenTo(this.childNode, "change:x", this.renderBranch);
        this.listenTo(this.parentNode, "update", this.renderBranch);
        this.listenTo(this.childNode, "update", this.renderBranch);
        this.listenTo(this.childNode, "destroy", this.delete);
        this.listenTo(this.parentNode, "destroy", this.delete);
    };

    BranchView.prototype.renderBranch = function () {
        if (!this.element) {
            this.element = this.app.Paper.path();
            this.parentNode.toFront();
            this.childNode.toFront();
            this.element.mouseover(this.onMouseOver.bind(this));
            this.element.mouseout(this.onMouseOut.bind(this));
        }

        this.element.attr({
            'path': this.getCurvePath(),
            'stroke-width': STROKE_WIDTH,
            'stroke-dasharray': this.getStrokeStyle(),
            'stroke': this.childNode.get('color') || this.parentNode.get('color') || "#000000"
        });
        this.renderLabel();
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

    BranchView.prototype.getStrokeStyle = function () {
        var style = this.childNode.get('style');
        var rangeType = this.parentNode.get('rangeType');
        if (style === "dashed" || rangeType === "rare") {
            return ["- "];
        } else if (style === "dotted") {
            return [". "];
        } else if (style === "solid") {
            return [" "];
		} else {
			if ( this.app.CurrentNode.get('parent') != null &&
					this.app.CurrentNode.get('type') === "BASE")
				return ["- "];
			else
				return [" "];
        }
    };

    BranchView.prototype.renderLabel = function () {
		var currentNodeName = this.app.CurrentNode.get('name');
		var currentNodeType = this.app.CurrentNode.get('type');
		if (this.parentLabel) {
		//	|| 
		//		(curentNodeName != "Root Base" && currentNodeType === "Top") {
			return;
		} else { // show parent label 
			// draw parent Label only once
			if (this.parentNode.get('rangelabel') != null)
				return;

			var text, x, y;
			// For Root Base range put above the root node 
			if (currentNodeType === "TOP" || currentNodeName === "Root Base") {
				if (currentNodeName === "Root Base") {
					text = "Root"; 
				} else {
					text = this.wrapString(this.parentNode.get('name'), 50, "\n", true);
				}

				x = this.parentNode.get('x') + this.app.CurrentNode.get('labelPadX');
				y = this.parentNode.get('y') - this.app.CurrentNode.get('labelPadY');
				this.parentLabel = this.app.Paper.text();
				this.parentLabel.attr({
					"text-anchor": "start",
					"x": x,
					"y": y,
					"text": text
				});
				this.parentLabel.rotate(-90, x, y);
				this.parentNode.set('rangelabel', this.parentLabel);
			}
		}
    };

    BranchView.prototype.onMouseOver = function () {
        this.element.attr({
            "stroke-width": HOVER_STROKE_WIDTH
        });
    };

    BranchView.prototype.onMouseOut = function () {
        this.element.attr({
            "stroke-width": STROKE_WIDTH
        });
    };

    BranchView.prototype.delete = function() {
        this.element.remove();
        if (this.image) this.image.remove();
        if (this.parentLabel) this.parentLabel.remove();
        if (this.childLabel) this.childLabel.remove();
    };

    return BranchView;
});
