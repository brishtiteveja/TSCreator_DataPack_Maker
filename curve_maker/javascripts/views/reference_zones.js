define(["./reference_zone"], function(ReferenceZoneView) {
  var ReferenceZones = Backbone.View.extend({
    tagName: "div",
    className: "reference-timelines",
    fixedWidth: 80,
    zoomMultiplier: 1,
    events: {
    }
  });
  
  ReferenceZones.prototype.initialize = function(options) {
    this.mainCanvasView = options.mainCanvasView;
    this.columnManager = options.columnManager;

    this.timelines = this.columnManager.retrieveCommonData("timelines");
    this.zones = this.columnManager.retrieveCommonData("zones");

    this.initCanvasEl();
    this.curViewBox = { x: 0, y: 0};
    //_.bindAll(this, "destroy", "render", "detachEl", "start", "stop");

    this.listenTo(this.zones, "add", this.addOne);
    this.listenTo(this.zones, "remove", this.removeOne);

    this.listenTo(this.mainCanvasView, "viewBoxChanged", this.onViewBoxChanged);
    this.listenTo(this.mainCanvasView, "zoomMultiplierChanged", this.onZoomMultiplierChanged);
    this.listenTo(this.mainCanvasView, "show:refZones", this.start);
    this.listenTo(this.mainCanvasView, "hide:refZones", this.stop);
    // stop first...
    this.stop();
  };

  ReferenceZones.prototype.initCanvasEl = function() {
    this.rPaper = Raphael(this.el, "100%", "100%");
  };


  ReferenceZones.prototype.addOne = function(zone, c, options) {
    //console.log "REG #{@model.get("name")} #{zone.get("name")}"
    var newReferenceZoneView = new ReferenceZoneView({
      model: zone,
      fixedWidth: this.fixedWidth,
      zoomMultiplier: this.zoomMultiplier,
      rCanvas: this.rPaper,
      mainCanvasView: this.mainCanvasView
    }).render();
  };
  ReferenceZones.prototype.removeOne = function(zone, c, options) {
    //console.log "UNREG #{@model.get("name")}: #{zone.get("name")}"
  };

  ReferenceZones.prototype.resize = function(dimension) {
    this.curDimension = dimension;
    this.$el.css("height", this.curDimension.height);
    this.updateViewBox();
  };
  ReferenceZones.prototype.onViewBoxChanged = function(curViewBox) {
    this.curViewBox = curViewBox;
    this.updateViewBox();
  };
  ReferenceZones.prototype.onZoomMultiplierChanged = function(zoomMultiplier) {
    this.zoomMultiplier = zoomMultiplier;
    this.updateViewBox();
  };
  ReferenceZones.prototype.updateViewBox = function () {
    this.rPaper.setViewBox(0, this.curViewBox.y,
                         this.fixedWidth * this.zoomMultiplier, this.curDimension.height * this.zoomMultiplier);
  };

  ReferenceZones.prototype.start = function() {
    //this.$el.show();
    // Note: Nasty bug.... https://github.com/DmitryBaranovskiy/raphael/issues/491
    this.$el.css("z-index", 0);
  };
  ReferenceZones.prototype.stop = function() {
    //this.$el.hide();
    // Note: Nasty bug.... https://github.com/DmitryBaranovskiy/raphael/issues/491
    this.$el.css("z-index", -999999);
  };

  return ReferenceZones;
});
