define([], function() {
  var CurveExport = Backbone.View.extend({
    tagName: "div",
    className: "data-export-panel",
    textHeaderTemplate: new EJS({ url: "templates/curves/export_header.text" }),
    textBodyTemplate: new EJS({ url: "templates/curves/export_body.text" }),
    events: {
      "click .export-to-file": "exportToFile"
    }
  });

  CurveExport.prototype.initialize = function(options) {
    this.mainCanvasView = options.mainCanvasView;
    this.initElements();

    _.bindAll(this, "render", "detachEl", "start", "stop");
    this.listenTo(this.mainCanvasView, "show:columnExportPreview", this.start);
    this.listenTo(this.mainCanvasView, "hide:columnExportPreview", this.stop);
  };

  CurveExport.prototype.initElements = function() {
    var $navSection = $("<div></div>").addClass("nav-section");
    var $dataSection = $("<div></div>").addClass("data-section");
    this.$el.append($navSection).append($dataSection);

    this.$exportButton = $("<div>Export</div>").attr({
      "class": "export-to-file icon"
    }).appendTo($dataSection);
    this.$selectors = $("<div class='export-selectors'><div>table</div><div>text</div></div>").attr({
      "class": "export-selectors"
    }).appendTo($dataSection);
    this.$htmlarea = $("<div></div>").attr({
      "class": "export-html-version"
    }).appendTo($dataSection);
    this.$textarea = $("<textarea></textarea>").attr({
      "readonly": true,
      "class": "export-text-version"
    }).appendTo($dataSection);
  };

  CurveExport.prototype.render = function() {
    var HTMLVersion = this.renderHTMLVersion();
    var textVersion = this.renderTextVersion();

    console.log(textVersion);
    this.$textarea.val(textVersion);
    return this;
  };

  CurveExport.prototype.renderHTMLVersion = function() {
    return "";
  };

  CurveExport.prototype.renderTextVersion = function() {
    var self = this;
    var output = self.textHeaderTemplate.render();
    try {
      var rangeMin = this.model.get("ranges").getMinRange().get("value");
      var rangeMax = this.model.get("ranges").getMaxRange().get("value");
      output += this.model.get("curves").map(function(c){
        json = c.toJSON();
        if(rangeMin != null) { json.rangeMin = rangeMin; }
        if(rangeMax != null) { json.rangeMax = rangeMax; }
        return self.textBodyTemplate.render(json);
      }).join("\n");

    } catch(err) {
      output = "Curve column is not ready to be exported!";
    }
    return output;
  };

  CurveExport.prototype.exportToFile = function () {
    var data = this.renderTextVersion();
    var url = 'data:text/plain;charset=utf8,' + encodeURIComponent(data);
    var filename = "test_output.txt";
    var blob = new Blob([data], { type: 'text/plain' });
    var dataUrl = URL.createObjectURL(blob);
    var $link = $("<a/>").attr({
      'download': filename,
      'href': dataUrl
    });
    $link[0].click();
    $link.remove();
  };

  CurveExport.prototype.detachEl = function() {
    this.$el.detach();
    return this;
  };

  CurveExport.prototype.start = function() {
    console.log("START: curve export view");
    this.render();
  };
  CurveExport.prototype.stop = function() {
    //console.log("STOP: curve export view");
    //this.detachEl();
  };

  return CurveExport;
});
