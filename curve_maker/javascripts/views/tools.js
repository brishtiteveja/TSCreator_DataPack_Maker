(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["../models/tool", "../models/tools", "./tool"], function(ToolModel, ToolCollection, ToolView) {
    var Tools;
    return Tools = (function(_super) {
      __extends(Tools, _super);

      function Tools() {
        this.render = __bind(this.render, this);
        this.activateTool = __bind(this.activateTool, this);
        this.addOne = __bind(this.addOne, this);
        return Tools.__super__.constructor.apply(this, arguments);
      }

      Tools.prototype.tagName = "div";

      Tools.prototype.initialize = function(options) {
        this.toolList = new ToolCollection();
        this.toolList.on("add", this.addOne);
        return this;
      };

      Tools.prototype.addOne = function(m) {
        var newToolView;
        newToolView = new ToolView({
          model: m
        }).render();
        m.view = newToolView;
        this.$el.append(newToolView.el);
        return this;
      };

      Tools.prototype.activateTool = function() {
        return this;
      };

      Tools.prototype.render = function() {
        this.toolList.add({
          name: "tool-pointer",
          title: "mouse pointer"
        });
        this.toolList.add({
          name: "tool-lock-cursor-h",
          title: "lock cursor in X."
        });
        this.toolList.add({
          name: "tool-lock-cursor-v",
          title: "lock cursor in V."
        });
        this.toolList.add({
          name: "tool-zoom-in",
          title: "zoom in"
        });
        this.toolList.add({
          name: "tool-zoom-out",
          title: "zoom out"
        });
        this.toolList.add({
          name: "tool-pan",
          title: "move"
        });
        this.toolList.add({
          name: "tool-add-marker",
          title: "create a new timeline"
        });
        this.toolList.add({
          name: "tool-add-range-lines",
          title: "Set up range reference lines"
        });
        this.toolList.add({
          name: "tool-show-ref-panel",
          title: "show reference panel"
        });
        this.toolList.add({
          name: "tool-save-to-local-storage",
          title: "save to local storage"
        });
        this.toolList.add({
          name: "tool-reload-data",
          title: "reload data from local storage"
        });
        this.toolList.add({
          name: "tool-export-data",
          title: "export data"
        });
        this.toolList.add({
          name: "tool-file-system",
          title: "sandbox"
        });
        return this;
      };

      return Tools;

    })(Backbone.View);
  });

}).call(this);
