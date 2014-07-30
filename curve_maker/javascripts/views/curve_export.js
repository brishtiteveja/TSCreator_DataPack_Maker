define([], function() {
  var CurveExport = Backbone.View.extend({
    tagName: "div",
    className: "data-export-panel",
    headerTemplate: new EJS({ url: "templates/curves/export_header.text" }),
    bodyTemplate: new EJS({ url: "templates/curves/export_body.text" }),
    events: {
    }
  });

  CurveExport.prototype.initialize = function(options) {
    _.bindAll(this, "render", "start", "stop");
    this.listenTo(this, "start:columnExportPreview", this.start);
    this.listenTo(this, "stop:columnExportPreview", this.stop);
  };

  CurveExport.prototype.render = function() {
    var self = this;
    var output = self.headerTemplate.render();
    try {
      var rangeMin = this.model.get("ranges").getMinRange().get("value");
      var rangeMax = this.model.get("ranges").getMaxRange().get("value");
      output += this.model.get("curves").map(function(c){
        json = c.toJSON();
        json.rangeMin = rangeMin;
        json.rangeMax = rangeMax;
        return self.bodyTemplate.render(json);
      }).join("\n\n");

      var data = output; 
      var url = 'data:text/plain;charset=utf8,' + encodeURIComponent(data)
      var filename = "test_output.txt"
      var blob = new Blob([data], { type: 'text/plain' })
      var dataUrl = URL.createObjectURL(blob)
      var $link = $("<a/>").attr({
        'download': filename,
        'href': dataUrl
      })
      $link[0].click()
      $link.remove()
    } catch(err) {
      output = "Curve column is not ready to be exported!";
    }
    
    this.$el.html(output);
    return this;
  };

  CurveExport.prototype.start = function() {
    //console.log("START: curve export view");
    this.render();
  };
  CurveExport.prototype.stop = function() {
    //console.log("STOP: curve export view");
  };

  return CurveExport;
});
