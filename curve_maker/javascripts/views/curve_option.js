(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define([], function() {
    var CurveOption;
    return CurveOption = (function(_super) {
      __extends(CurveOption, _super);

      function CurveOption() {
        this.render = __bind(this.render, this);
        this.updateWrapper = __bind(this.updateWrapper, this);
        this.toggleWrapper = __bind(this.toggleWrapper, this);
        this.destroy = __bind(this.destroy, this);
        this.fillColorAction = __bind(this.fillColorAction, this);
        this.fillCurveAction = __bind(this.fillCurveAction, this);
        this.showLinesAction = __bind(this.showLinesAction, this);
        this.showPointsAction = __bind(this.showPointsAction, this);
        this.smoothedAction = __bind(this.smoothedAction, this);
        this.changeFillColor = __bind(this.changeFillColor, this);
        this.changeIsFillCurve = __bind(this.changeIsFillCurve, this);
        this.changeIsShowLines = __bind(this.changeIsShowLines, this);
        this.changeIsShowPoints = __bind(this.changeIsShowPoints, this);
        this.changeIsSmoothed = __bind(this.changeIsSmoothed, this);
        this.detachEl = __bind(this.detachEl, this);
        return CurveOption.__super__.constructor.apply(this, arguments);
      }

      CurveOption.prototype.className = "display-options";

      CurveOption.prototype.template = new EJS({
        url: "templates/curves/option"
      });

      CurveOption.prototype.isExpanded = true;

      CurveOption.prototype.events = {
        "click .sublist-header": "toggleWrapper",
        "click .smoothed-btn": "smoothedAction",
        "click .show-points-btn": "showPointsAction",
        "click .show-lines-btn": "showLinesAction",
        "click .fill-curve-btn": "fillCurveAction",
        "change input[name=fillColor]": "fillColorAction"
      };

      CurveOption.prototype.initialize = function(options) {
        this.points = options.points;
        this.lines = options.lines;
        this.listenTo(this.model, "destroy", this.destroy);
        this.listenTo(this.model, {
          "change:isSmoothed": this.changeIsSmoothed,
          "change:isShowPoints": this.changeIsShowPoints,
          "change:isShowLines": this.changeIsShowLines,
          "change:isFillCurve": this.changeIsFillCurve,
          "change:fillColor": this.changeFillColor
        });
        return this;
      };

      CurveOption.prototype.detachEl = function() {
        this.$el.detach();
        return this;
      };

      CurveOption.prototype.changeIsSmoothed = function(m, value, options) {
        var $button;
        $button = this.$el.find(".smoothed-btn");
        if (value) {
          $button.removeClass("off");
        } else {
          $button.addClass("off");
        }
        return this;
      };

      CurveOption.prototype.changeIsShowPoints = function(m, value, options) {
        var $button;
        $button = this.$el.find(".show-points-btn");
        if (value) {
          $button.removeClass("off");
        } else {
          $button.addClass("off");
        }
        return this;
      };

      CurveOption.prototype.changeIsShowLines = function(m, value, options) {
        var $button;
        $button = this.$el.find(".show-lines-btn");
        if (value) {
          $button.removeClass("off");
        } else {
          $button.addClass("off");
        }
        return this;
      };

      CurveOption.prototype.changeIsFillCurve = function(m, value, options) {
        var $button;
        $button = this.$el.find(".fill-curve-btn");
        if (value) {
          $button.removeClass("off");
        } else {
          $button.addClass("off");
        }
        return this;
      };

      CurveOption.prototype.changeFillColor = function(m, value, options) {
        var $input;
        $input = this.$el.find("input[name=fillColor]");
        $input.val(value);
        return this;
      };

      CurveOption.prototype.smoothedAction = function($evt) {
        var value;
        value = $($evt.target).hasClass("off");
        this.model.set("isSmoothed", value);
        return this;
      };

      CurveOption.prototype.showPointsAction = function($evt) {
        var value;
        value = $($evt.target).hasClass("off");
        this.model.set("isShowPoints", value);
        return this;
      };

      CurveOption.prototype.showLinesAction = function($evt) {
        var value;
        value = $($evt.target).hasClass("off");
        this.model.set("isShowLines", value);
        return this;
      };

      CurveOption.prototype.fillCurveAction = function($evt) {
        var value;
        value = $($evt.target).hasClass("off");
        this.model.set("isFillCurve", value);
        return this;
      };

      CurveOption.prototype.fillColorAction = function($evt) {
        this.model.set("fillColor", $($evt.target).val());
        return this;
      };

      CurveOption.prototype.destroy = function() {
        this.remove();
        return this;
      };

      CurveOption.prototype.toggleWrapper = function() {
        this.isExpanded = !this.isExpanded;
        this.updateWrapper();
        return this;
      };

      CurveOption.prototype.updateWrapper = function() {
        if (this.isExpanded) {
          this.$el.find(".sublist-header .icon-btn").removeClass("sublist-edit-btn").addClass("sublist-cancel-btn");
          this.$el.children().not(".sublist-header").show();
        } else {
          this.$el.find(".sublist-header .icon-btn").removeClass("sublist-cancel-btn").addClass("sublist-edit-btn");
          this.$el.children().not(".sublist-header").hide();
        }
        return this;
      };

      CurveOption.prototype.render = function() {
        this.$el.html(this.template.render(this.model.toJSON()));
        return this;
      };

      return CurveOption;

    })(Backbone.View);
  });

}).call(this);
