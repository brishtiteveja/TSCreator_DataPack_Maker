define([], function() {
  var INF = 500000;
  var SMALLINF = 10000;

  var ReferenceZone = Backbone.View.extend({
    strokeColor: "#900000",
    strokeWidth: 2,
    textFontSize: 20
  });

  ReferenceZone.prototype.initialize = function(options) {
    this.rCanvas = options.rCanvas;
    this.mainCanvasView = options.mainCanvasView;
    this.zoomMultiplier = options.zoomMultiplier;
    this.fixedWidth = options.fixedWidth;

    this.initCanvasEl();

    this.listenTo(this.model, "destroy", this.destroy);

    this._registerTimeline(this.model.get("top"));
    this._registerTimeline(this.model.get("base"));
    this.listenTo(this.model, "change:top", this.onTopChanged);
    this.listenTo(this.model, "change:base", this.onBaseChanged);
    this.listenTo(this.model, "change:name", this.render);

    this.listenTo(this.model, "highlight", this.highlight);
    this.listenTo(this.model, "unhighlight", this.unhighlight);
    
    this.listenTo(this.mainCanvasView, "zoomMultiplierChanged", this.onZoomMultiplierChanged);
  };
  ReferenceZone.prototype.destroy = function() {
    this.rEl.remove();
    this.rText.remove();
    this.remove();
    return this;
  };
  ReferenceZone.prototype.initCanvasEl = function() {
    var topY = this.model.get("top").get("y");
    var baseY = this.model.get("base").get("y");
    this.rEl = this.rCanvas.rect();
    this.rEl.attr({
      x: -SMALLINF,
      width: 2*SMALLINF,
      fill: this.model.get("backgroundColor"),
      stroke: this.strokeColor,
      "stroke-width": this.strokeWidth
    });
    this.rText = this.rCanvas.text();
    window.x = this.rText;
  };
  
  ReferenceZone.prototype.onTopChanged = function(m, newTimeline, options) {
    this._unregisterTimeline(m.previous("top"));
    this._registerTimeline(newTimeline);
  };
  ReferenceZone.prototype.onBaseChanged = function() {
    this._unregisterTimeline(m.previous("top"));
    this._registerTimeline(newTimeline);
  };
  ReferenceZone.prototype._registerTimeline = function(timeline) {
    this.listenTo(timeline, "change:y", this.render);
    this.render();
  };
  ReferenceZone.prototype._unregisterTimeline = function(timeline) {
    this.stopListening(timeline, "change:y", this.render);
  };
  ReferenceZone.prototype.onZoomMultiplierChanged = function(zoomMultiplier) {
    this.zoomMultiplier = zoomMultiplier;
    this.render();
  };
  ReferenceZone.prototype.highlight = function() {
    this.rText.attr({
      fill: "#FF0000"
    });
  };
  ReferenceZone.prototype.unhighlight = function() {
    this.rText.attr({
      fill: "#000000"
    });
  };
  ReferenceZone.prototype.render = function() {
    var topY = this.model.get("top").get("y");
    var baseY = this.model.get("base").get("y");
	
    if(baseY < topY)  
        return this;

    this.rEl.attr({
      y: topY,
      height: baseY - topY
    });

    var fontSize = this.textFontSize * this.zoomMultiplier;
    if(fontSize > 30) { fontSize = 30; } // Max font-size = 30...

    this.rText.attr({
      x: (this.fixedWidth/2) * this.zoomMultiplier,
      y: (topY + baseY)/2,
      text: TSCreator.utils.templatehelpers.truncateIfLong(this.model.get("name"), 7, "."),
      "font-size": fontSize
    }).toFront();
    return this;
  };
  
  return ReferenceZone;
});
