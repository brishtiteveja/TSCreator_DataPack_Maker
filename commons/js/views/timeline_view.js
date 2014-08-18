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
        return "M0," + this.timeline.get('y') + 'H' + (this.app.width || this.app.Paper.width);
    };

    TimelineView.prototype.renderTimeline = function () {
        if (!this.element) {
            this.element = this.app.Paper.path();
            this.element.attr({
                "stroke-width": 2,
                "stroke": "#900000"
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

        this.label.attr({
            "text": this.timeline.get('y'),
            "x": 100,
            "y": this.timeline.get('y'),
            "fill": "#900000",
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
        });

        this.bgBox.toFront();
        this.label.toFront();

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