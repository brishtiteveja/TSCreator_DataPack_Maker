define([], function() {
  var CurveExport = Backbone.View.extend({
    tagName: "div",
    className: "data-export-panel",
    events: {
    }
  });

  CurveExport.prototype.initialize = function(options) {
    _.bindAll(this, "render", "start", "stop");
    this.listenTo(this, "start:columnExportPreview", this.start);
    this.listenTo(this, "stop:columnExportPreview", this.stop);
  };

  CurveExport.prototype.render = function() {
    //this.$el.html(this.template.render(this.model.toJSON()));
    this.model.get("curves");
    return this;
  };

  CurveExport.prototype.start = function() {
    console.log("START: curve export view");
  };
  CurveExport.prototype.stop = function() {
    console.log("STOP: curve export view");
  };

  return CurveExport;
});
