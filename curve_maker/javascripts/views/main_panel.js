(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define([], function() {
    var MainPanel;
    return MainPanel = (function(_super) {
      __extends(MainPanel, _super);

      function MainPanel() {
        this.render = __bind(this.render, this);
        this.startAndReplaceImage = __bind(this.startAndReplaceImage, this);
        return MainPanel.__super__.constructor.apply(this, arguments);
      }

      MainPanel.prototype.tagName = "main";

      MainPanel.prototype.introTemplate = new EJS({
        url: "templates/intro.ejs"
      });

      MainPanel.prototype.events = {
        "dragOver .image-dropbox": "dragCleanup",
        "dragEnter .image-dropbox": "dragCleanup",
        "drop .image-dropbox": "startAndReplaceImage"
      };

      MainPanel.prototype.initialize = function(options) {
        return this;
      };

      MainPanel.prototype.dragCleanup = function($evt) {
        $evt.preventDefault();
        $evt.stopPropagation();
        console.log($evt);
        return this;
      };

      MainPanel.prototype.startAndReplaceImage = function($evt) {
        var oEvent;
        $evt.preventDefault();
        $evt.stopPropagation();
        oEvent = $evt.originalEvent;
        oEvent.preventDefault();
        oEvent.stopPropagation();
        console.log($evt);
        return this;
      };

      MainPanel.prototype.render = function() {
        this.$el.html(this.introTemplate.render());
        return this;
      };

      return MainPanel;

    })(Backbone.View);
  });

}).call(this);
