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
        this.destroy = __bind(this.destroy, this);
        this.fillColorAction = __bind(this.fillColorAction, this);
        this.fillCurveAction = __bind(this.fillCurveAction, this);
        this.showLinesAction = __bind(this.showLinesAction, this);
        this.showPointsAction = __bind(this.showPointsAction, this);
        this.smoothedAction = __bind(this.smoothedAction, this);
        this.detachEl = __bind(this.detachEl, this);
        return CurveOption.__super__.constructor.apply(this, arguments);
      }

      CurveOption.prototype.className = "display-options";

      CurveOption.prototype.template = new EJS({
        url: "templates/curves/option"
      });

      CurveOption.prototype.events = {
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
        return this;
      };

      CurveOption.prototype.detachEl = function() {
        this.$el.detach();
        return this;
      };

      CurveOption.prototype.smoothedAction = function($evt) {
        var value;
        value = !this.model.get("isSmoothed");
        if (value) {
          $($evt.target).removeClass("off");
        } else {
          $($evt.target).addClass("off");
        }
        this.model.set("isSmoothed", value);
        return this;
      };

      CurveOption.prototype.showPointsAction = function($evt) {
        var value;
        value = !this.model.get("isShowPoints");
        if (value) {
          $($evt.target).removeClass("off");
        } else {
          $($evt.target).addClass("off");
        }
        this.model.set("isShowPoints", value);
        return this;
      };

      CurveOption.prototype.showLinesAction = function($evt) {
        var value;
        value = !this.model.get("isShowLines");
        if (value) {
          $($evt.target).removeClass("off");
        } else {
          $($evt.target).addClass("off");
        }
        this.model.set("isShowLines", value);
        return this;
      };

      CurveOption.prototype.fillCurveAction = function($evt) {
        var value;
        value = !this.model.get("isFillCurve");
        if (value) {
          $($evt.target).removeClass("off");
        } else {
          $($evt.target).addClass("off");
        }
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

      CurveOption.prototype.render = function() {
        this.$el.html(this.template.render(this.model.toJSON()));
        return this;
      };

      return CurveOption;

    })(Backbone.View);
  });

}).call(this);
