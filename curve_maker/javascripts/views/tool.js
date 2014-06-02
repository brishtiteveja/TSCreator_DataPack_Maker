(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["../models/tool"], function(ToolModel) {
    var Tool;
    return Tool = (function(_super) {
      __extends(Tool, _super);

      function Tool() {
        this.render = __bind(this.render, this);
        this.changeClassName = __bind(this.changeClassName, this);
        this.toggleTool = __bind(this.toggleTool, this);
        return Tool.__super__.constructor.apply(this, arguments);
      }

      Tool.prototype.tagName = "div";

      Tool.prototype.events = {
        "click": "toggleTool"
      };

      Tool.prototype.initialize = function() {
        this.model.on("change:isActivated", this.changeClassName);
        return this;
      };

      Tool.prototype.toggleTool = function($evt) {
        $evt.preventDefault();
        this.model.collection.trigger("toggleTool", this.model);
        return this;
      };

      Tool.prototype.changeClassName = function() {
        if (this.model.get("isActivated") && !this.$el.hasClass("selected")) {
          this.$el.addClass("selected");
        } else {
          this.$el.removeClass("selected");
        }
        return this;
      };

      Tool.prototype.render = function() {
        this.$link = $("<span/>", {
          "class": "maker-tool icon",
          title: this.model.get("title")
        }).addClass(this.model.get("name"));
        this.$el.html(this.$link);
        return this;
      };

      return Tool;

    })(Backbone.View);
  });

}).call(this);
