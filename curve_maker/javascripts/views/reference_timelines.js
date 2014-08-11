define([], function() {
  var INF = 500000;
  var SMALLINF = 10000;

  var ReferenceTimelines = Backbone.View.extend({
    tagName: "div",
    className: "reference-timelines",
    events: {
    }
  });
  
  ReferenceTimelines.prototype.initialize = function(options) {
    this.mainCanvasView = options.mainCanvasView;
    this.columnManager = options.columnManager;

    this.timelines = this.columnManager.retrieveCommonData("timelines");
    this.zones = this.columnManager.retrieveCommonData("zones");

    this.initCanvasEl();
    //_.bindAll(this, "destroy", "render", "detachEl", "start", "stop");

    this.listenTo(this.mainCanvasView, "show:refTimelines", this.start);
    this.listenTo(this.mainCanvasView, "hide:refTimelines", this.stop);
    // stop first...
    this.stop();
  };

  ReferenceTimelines.prototype.initCanvasEl = function() {
    this.rPaper = Raphael(this.el, "100%", "100%");
    /*var newOverlay = this.rPaper.rect(-INF, -INF, 2*INF, 2*INF);
    newOverlay.attr({
        "fill": "#FFFFFF",
        "fill-opacity": 0,
        "stroke-width": 0
    });*/
  };

  ReferenceTimelines.prototype.start = function() {
    this.$el.show();
  };
  ReferenceTimelines.prototype.stop = function() {
    this.$el.hide();
  };

  return ReferenceTimelines;
});
