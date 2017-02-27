(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["../models/tool", "../models/tools", "./tool", "../models/detail"], function(ToolModel, ToolCollection, ToolView) {
    var Tools;
    return Tools = (function(_super) {
      __extends(Tools, _super);

      function Tools() {
        this.deactivateTogglableTool = __bind(this.deactivateTogglableTool, this);
        this.activateTogglableTool = __bind(this.activateTogglableTool, this);
        this.deactivateAllTogglableTools = __bind(this.deactivateAllTogglableTools, this);
        this.selectTool = __bind(this.selectTool, this);
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
        this.columnManager = options.columnManager;
        this.collection.add(this.columnManager.getAllToolsForCurrentColumn());
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
