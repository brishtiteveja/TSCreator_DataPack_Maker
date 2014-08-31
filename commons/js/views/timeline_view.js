define(["baseView", "timeline"], function (BaseView, Timeline) {

    var TimelineView = BaseView.extend();

    TimelineView.prototype.initialize = function (timeline, app) {
        this.timeline = timeline;
        this.app = app;

        this.listentToEvents();
        this.renderTimeline();
    };

    TimelineView.prototype.listentToEvents = function () {
        this.listenTo(this.timeline, "change", this.renderTimeline.bind(this));
        $("#canvas").mousemove(this.updateTimeline.bind(this));
    };

    TimelineView.prototype.getPath = function () {
        var locationX1 = ViewboxToPaper(this.app, 0, 0).x;
        var locationX2 = ViewboxToPaper(this.app, this.app.Paper.width, 0).x;
        return "M" + locationX1 + "," + this.timeline.get('y') + 'H' + locationX2;
    };

    TimelineView.prototype.renderTimeline = function () {
        if (!this.element) {
            this.element = this.app.Paper.path();
            this.element.attr({
                "stroke-width": 2,
                "stroke": "#6666FF",
                "stroke-dasharray": ["-"]
            });
        }
        this.element.attr({
            'path': this.getPath()
        });
        this.renderLabel();
    };

    TimelineView.prototype.renderLabel = function () {
        if (!this.label) {
            this.label = this.app.Paper.text();
            this.bgBox = this.app.Paper.rect();
        }

        var locationX = ViewboxToPaper(this.app, this.app.Paper.width - 300, 0).x;

        this.label.attr({
            "text": this.timeline.getLabel(),
            "x": locationX,
            "y": this.timeline.get('y'),
            "fill": "#6666FF",
            "fill-opacity": 1,
            "font-size": 18
        });

        this.bgBox.attr({
            "fill-opacity": 1,
            "fill": "#ffffff",
            "r": "2px",
            "width": this.label.getBBox().width,
            "height": this.label.getBBox().height,
            "x": this.label.getBBox().x,
            "y": this.label.getBBox().y,
            "stroke": "#6666FF"
        });

        this.label.toBack();
        this.bgBox.toBack();
        this.element.toBack();
    };

    TimelineView.prototype.updateTimeline = function (evt) {
        var cdts = ViewboxToPaper(this.app, evt.offsetX, evt.offsetY);
        var locationX = cdts.x;
        var locationY = cdts.y;
        this.timeline.set({
            y: cdts.y
        });
    };

    return TimelineView;
});