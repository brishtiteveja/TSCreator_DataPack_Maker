(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["../models/tool", "../models/tools", "./tool"], function(ToolModel, ToolCollection, ToolView) {
    var Tools;
    return Tools = (function(_super) {
      __extends(Tools, _super);

      function Tools() {
        this.deactivateTogglableTool = __bind(this.deactivateTogglableTool, this);
        this.activateTogglableTool = __bind(this.activateTogglableTool, this);
        this.deactivateAllTogglableTools = __bind(this.deactivateAllTogglableTools, this);
        this.selectTool = __bind(this.selectTool, this);
        this.render = __bind(this.render, this);
        this.resize = __bind(this.resize, this);
        this.forceToRedraw = __bind(this.forceToRedraw, this);
        this.addOne = __bind(this.addOne, this);
        return Tools.__super__.constructor.apply(this, arguments);
      }

      Tools.prototype.tagName = "div";

      Tools.prototype.events = {
        "mouseleave": "forceToRedraw"
      };

      Tools.prototype.initialize = function(options) {
        this.collection = new ToolCollection();
        this.listenTo(this.collection, "add", this.addOne);
        this.listenTo(this.collection, "selectTool", this.selectTool);
        this.listenTo(this, "deactivateAll", this.deactivateAllTogglableTools);
        return this;
      };

      Tools.prototype.addOne = function(m) {
        var newToolView;
        newToolView = new ToolView({
          model: m
        }).render();
        this.$el.append(newToolView.el);
        return this;
      };

      Tools.prototype.forceToRedraw = function($evt) {
        this.$el.hide().show(0);
        return this;
      };

      Tools.prototype.resize = function(dimension) {
        this.$el.css(dimension);
        return this;
      };

      Tools.prototype.render = function() {
        this.collection.add({
          name: "pointer",
          action: {
            type: "toggle",
            groupId: 1,
            startEvent: "noop",
            stopEvent: "noop"
          },
          title: "mouse pointer"
        });
        this.collection.add({
          name: "lock-cursor-h",
          action: {
            type: "toggle",
            groupId: 2,
            startEvent: "noop",
            stopEvent: "noop"
          },
          title: "lock cursor in X."
        });
        this.collection.add({
          name: "lock-cursor-v",
          action: {
            type: "toggle",
            groupId: 2,
            startEvent: "noop",
            stopEvent: "noop"
          },
          title: "lock cursor in V."
        });
        this.collection.add({
          name: "zoom-in",
          action: {
            type: "click",
            event: "zoomIn"
          },
          title: "zoom in"
        });
        this.collection.add({
          name: "zoom-out",
          action: {
            type: "click",
            event: "zoomOut"
          },
          title: "zoom out"
        });
        this.collection.add({
          name: "pan",
          action: {
            type: "toggle",
            groupId: 1,
            startEvent: "start:panning",
            stopEvent: "stop:panning"
          },
          title: "move"
        });
        this.collection.add({
          name: "add-timeline",
          action: {
            type: "toggle",
            groupId: 1,
            startEvent: "start:addingTimeline",
            stopEvent: "stop:addingTimeline"
          },
          title: "create a new timeline"
        });
        this.collection.add({
          name: "add-range-lines",
          action: {
            type: "toggle",
            groupId: 1,
            startEvent: "start:addingRange",
            stopEvent: "stop:addingRange"
          },
          title: "Set up range limits"
        });
        this.collection.add({
          name: "add-new-curve",
          action: {
            type: "toggle",
            groupId: 1,
            startEvent: "start:addingCurve",
            stopEvent: "stop:addingCurve"
          },
          title: "Add a new curve"
        });
        this.collection.add({
          name: "show-ref-panel",
          action: {
            type: "toggle",
            groupId: 3,
            startEvent: "showRefTimelines",
            stopEvent: "hideRefTimelines"
          },
          title: "show reference panel"
        });
        this.collection.add({
          name: "save-to-local-storage",
          action: {
            type: "click",
            event: "saveToLocalJSON"
          },
          title: "save to local storage"
        });
        this.collection.add({
          name: "reload-data",
          action: {
            type: "click",
            event: "quickReload"
          },
          title: "reload data from local storage"
        });
        this.collection.add({
          name: "export-data",
          action: {
            type: "toggle",
            groupId: 1,
            startEvent: "showExportPreview",
            stopEvent: "hideExportPreview"
          },
          title: "export data"
        });
        this.collection.add({
          name: "file-system",
          action: {
            type: "toggle",
            groupId: 1,
            startEvent: "showSandbox",
            stopEvent: "hideSandbox"
          },
          title: "sandbox"
        });
        return this;
      };

      Tools.prototype.selectTool = function(m) {
        var action;
        action = m.get("action");
        if (action.type === "click") {
          this.trigger(action.event);
        } else if (action.type === "toggle") {
          this.collection.chain().select(function(tool) {
            var a;
            a = tool.get("action");
            return tool.isActivated() && tool !== m && a.type === action.type && a.groupId === action.groupId;
          }).each(this.deactivateTogglableTool);
          if (m.isActivated()) {
            this.deactivateTogglableTool(m);
          } else {
            this.activateTogglableTool(m);
          }
        }
        return this;
      };

      Tools.prototype.deactivateAllTogglableTools = function() {
        this.collection.chain().select(function(tool) {
          var a;
          a = tool.get("action");
          return tool.isActivated() && a.type === "toggle";
        }).each(this.deactivateTogglableTool);
        return this;
      };

      Tools.prototype.activateTogglableTool = function(m) {
        var a;
        a = m.get("action");
        if (a.type === "toggle") {
          m.activate();
          this.trigger(a.startEvent);
        }
        return this;
      };

      Tools.prototype.deactivateTogglableTool = function(m) {
        var a;
        a = m.get("action");
        if (a.type === "toggle") {
          m.deactivate();
          this.trigger(a.stopEvent);
        }
        return this;
      };

      return Tools;

    })(Backbone.View);
  });

}).call(this);
