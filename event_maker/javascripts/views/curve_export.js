define([], function() {
  var CurveExport = Backbone.View.extend({
    tagName: "div",
    className: "data-export-panel",
    template: new EJS({ url: "templates/events/export.ejs" }),
    htmlBodyTemplate: new EJS({ url: "templates/events/export_body.html" }),
    textHeaderTemplate: new EJS({ url: "templates/events/export_header.text" }),
    textBodyTemplate: new EJS({ url: "templates/events/export_body.text" }),
    events: {
      "click .export-btn": "exportToFile",
      "click .show-html": "showHtmlVersion",
      "click .show-text": "showTextVersion"
    }
  });

  CurveExport.prototype.initialize = function(options) {
	this.options = options;
    this.mainCanvasView = options.mainCanvasView;
    this.initElements();

    _.bindAll(this, "destroy", "render", "detachEl", "start", "stop");
    this.listenTo(this.model, "destroy", this.destroy);
    
    this.listenTo(this.mainCanvasView, "show:columnExportPreview", this.start);
    this.listenTo(this.mainCanvasView, "hide:columnExportPreview", this.stop);

    // stop first...
    this.stop();
  };

  CurveExport.prototype.initElements = function() {
    this.$el.html(this.template.render());

    this.$showHtmlButton = this.$el.find(".show-html");
    this.$htmlPanel = this.$el.find(".html-panel");

    this.$showTextButton = this.$el.find(".show-text");
    this.$textPanel = this.$el.find(".text-panel");
    this.$textarea = $("<textarea></textarea>").attr({
      "readonly": true
    }).appendTo(this.$textPanel);

    // Initially show HTML version
    this.showHtmlVersion();
  };
  CurveExport.prototype.showHtmlVersion = function($evt) {
    this.$showHtmlButton.addClass("selected");
    this.$htmlPanel.show();
    
    this.$showTextButton.removeClass("selected");
    this.$textPanel.hide();
  };
  CurveExport.prototype.showTextVersion = function($evt) {
    this.$showTextButton.addClass("selected");
    this.$textPanel.show();
    this._fixTextareaSize(); // fix it...

    this.$showHtmlButton.removeClass("selected");
    this.$htmlPanel.hide();
  };

  CurveExport.prototype.destroy = function() {
    this.remove();
  };

  CurveExport.prototype.render = function() {
    var htmlVersion = this._renderHtmlVersion();
    var textVersion = this._renderTextVersion();

    this.$htmlPanel.html(htmlVersion);
    this.$textarea.val(textVersion);
    return this;
  };
  CurveExport.prototype._fixTextareaSize = function() {
    this.$textarea.css("height", this.$textarea.get(0).scrollHeight);
  };

  CurveExport.prototype._renderHtmlVersion = function() {
    var self = this;
    var output = "";
    try {
      var rangeMin = this.model.get("ranges").getMinRange().get("value");
      var rangeMax = this.model.get("ranges").getMaxRange().get("value");
      output += this.model.get("curves").map(function(c){
        json = c.toJSON();
        if(rangeMin != null) { json.rangeMin = rangeMin; }
        if(rangeMax != null) { json.rangeMax = rangeMax; }
        return self.htmlBodyTemplate.render(json);
      }).join("\n");

    } catch(err) {
      output = "This column is not ready to be exported!";
    }
    return output;
  };

  CurveExport.prototype._renderTextVersion = function() {
    var self = this;
    var output = self.textHeaderTemplate.render();
    var tmpOutput = "";
    try {
      var rangeMin = this.model.get("ranges").getMinRange().get("value");
      var rangeMax = this.model.get("ranges").getMaxRange().get("value");
      
      //LAD
      tmpOutput += this.model.get("curves").map(function(c){
        json = c.toJSON();
        if(rangeMin != null) { json.rangeMin = rangeMin; }
        if(rangeMax != null) { json.rangeMax = rangeMax; }
        var eventType = json.option.get("eventType");
        if (eventType == "LAD")
        	return self.textBodyTemplate.render(json);
      }).join("");

      if (tmpOutput != "") {
    	  output += "LAD\n" + tmpOutput;
      }
      
      //FAD
      tmpOutput = "";
      tmpOutput += this.model.get("curves").map(function(c){
        json = c.toJSON();
        if(rangeMin != null) { json.rangeMin = rangeMin; }
        if(rangeMax != null) { json.rangeMax = rangeMax; }
        var eventType = json.option.get("eventType");
        if (eventType == "FAD")
        	return self.textBodyTemplate.render(json);
      }).join("");

      if (tmpOutput != "") {
    	  output += "FAD\n" + tmpOutput;
      }
      
      
      //EVENT
      tmpOutput = "";
      tmpOutput += this.model.get("curves").map(function(c){
        json = c.toJSON();
        if(rangeMin != null) { json.rangeMin = rangeMin; }
        if(rangeMax != null) { json.rangeMax = rangeMax; }
        var eventType = json.option.get("eventType");
        if (eventType == "EVENT")
        	return self.textBodyTemplate.render(json);
      }).join("");

      if (tmpOutput != "") {
    	  output += "EVENT\n" + tmpOutput;
      }

    } catch(err) {
      output = "This column is not ready to be exported!";
    }
    return output;
  };

  CurveExport.prototype.exportToFile = function () {
    var data = this._renderTextVersion();
    var url = 'data:text/plain;charset=utf8,' + encodeURIComponent(data);
    var filename = "event_datapack.txt";
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
    this.render();
    this.$el.show();
  };
  CurveExport.prototype.stop = function() {
    this.$el.hide();
  };

  return CurveExport;
});
