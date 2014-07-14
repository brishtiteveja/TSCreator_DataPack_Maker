(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["./points", "./lines", "../models/curve_option", "./curve_option"], function(PointsView, LinesView, CurveOptionModel, CurveOptionView) {
    var Curve;
    return Curve = (function(_super) {
      __extends(Curve, _super);

      function Curve() {
        this.stop = __bind(this.stop, this);
        this.start = __bind(this.start, this);
        this.toBack = __bind(this.toBack, this);
        this.toFront = __bind(this.toFront, this);
        this.unhighlight = __bind(this.unhighlight, this);
        this.highlight = __bind(this.highlight, this);
        this.unselected = __bind(this.unselected, this);
        this.selected = __bind(this.selected, this);
        this.onSelect = __bind(this.onSelect, this);
        this.onMouseOut = __bind(this.onMouseOut, this);
        this.onMouseOver = __bind(this.onMouseOver, this);
        this.render = __bind(this.render, this);
        this._insertAfterMe = __bind(this._insertAfterMe, this);
        this.smoothedAction = __bind(this.smoothedAction, this);
        this.cancelAction = __bind(this.cancelAction, this);
        this.deleteAction = __bind(this.deleteAction, this);
        this.editAction = __bind(this.editAction, this);
        this.inputUpdate = __bind(this.inputUpdate, this);
        this.destroy = __bind(this.destroy, this);
        this._cleanupOptionView = __bind(this._cleanupOptionView, this);
        this._cleanupLinesView = __bind(this._cleanupLinesView, this);
        this._cleanupPointsView = __bind(this._cleanupPointsView, this);
        this.template = __bind(this.template, this);
        return Curve.__super__.constructor.apply(this, arguments);
      }

      Curve.prototype.tagName = "div";

      Curve.prototype.className = "data-list";

      Curve.prototype.showTemplate = new EJS({
        url: "templates/curves/show"
      });

      Curve.prototype.editTemplate = new EJS({
        url: "templates/curves/edit"
      });

      Curve.prototype.template = function() {
        var temp;
        temp = this.isEditing ? this.editTemplate : this.showTemplate;
        return temp.render.apply(temp, arguments);
      };

      Curve.prototype.isEditing = false;

      Curve.prototype.isSelected = false;

      Curve.prototype.normalStrokeWidth = 2;

      Curve.prototype.hoverStrokeWidth = 5;

      Curve.prototype.events = {
        "click .edit-btn": "editAction",
        "click .delete-btn": "deleteAction",
        "click .cancel-btn": "cancelAction",
        "change input[type=text]": "inputUpdate",
        "mouseover": "onMouseOver",
        "mouseout": "onMouseOut"
      };

      Curve.prototype.initialize = function(options) {
        this.mainCanvasView = options.mainCanvasView;
        this.start();
        this.listenTo(this.model, {
          "_insertAfterMe": this._insertAfterMe,
          "destroy": this.destroy
        });
        this.listenTo(this.model, {
          "selected": this.selected,
          "unselected": this.unselected,
          "highlight": this.highlight,
          "unhighlight": this.unhighlight,
          "toFront": this.toFront,
          "toBack": this.toBack
        });
        this.listenTo(this.mainCanvasView, {
          "start:addingCurve": this.start,
          "stop:addingCurve": this.stop
        });
        this._setupPointsView();
        this._setupLinesView();
        this._setupOptionView();
        return this;
      };

      Curve.prototype._setupPointsView = function() {
        this.pointsView = new PointsView({
          collection: this.model.get("points"),
          lines: this.model.get("lines"),
          columnManager: this.columnManager,
          mainCanvasView: this.mainCanvasView
        }).render();
        return this;
      };

      Curve.prototype._cleanupPointsView = function() {
        this.model.get("points").trigger("destroyAll");
        this.pointsView.detachEl();
        this.pointsView.trigger("destroy");
        return this;
      };

      Curve.prototype._setupLinesView = function() {
        this.linesView = new LinesView({
          collection: this.model.get("lines"),
          points: this.model.get("points"),
          columnManager: this.columnManager,
          mainCanvasView: this.mainCanvasView
        }).render();
        return this;
      };

      Curve.prototype._cleanupLinesView = function() {
        this.linesView.detachEl();
        this.linesView.trigger("destroy");
        return this;
      };

      Curve.prototype._setupOptionView = function() {
        this.model.set("option", new CurveOptionModel);
        this.optionView = new CurveOptionView({
          model: this.model.get("option"),
          points: this.model.get("points"),
          lines: this.model.get("lines")
        }).render();
        return this;
      };

      Curve.prototype._cleanupOptionView = function() {
        this.optionView.detachEl();
        this.model.get("option").destroy();
        return this;
      };

      Curve.prototype.destroy = function() {
        this._cleanupPointsView();
        this._cleanupLinesView();
        this._cleanupOptionView();
        this.stop();
        this.undelegateEvents();
        this.remove();
        return this;
      };

      Curve.prototype.inputUpdate = function($evt) {
        var $input, key, value;
        $input = $($evt.target);
        key = $input.attr("name");
        value = $input.val();
        this.model.set(key, value);
        return this;
      };

      Curve.prototype.editAction = function($evt) {
        $evt.stopImmediatePropagation();
        this.isEditing = true;
        this.render();
        return this;
      };

      Curve.prototype.deleteAction = function($evt) {
        $evt.stopImmediatePropagation();
        this.model.destroy();
        return this;
      };

      Curve.prototype.cancelAction = function($evt) {
        $evt.stopImmediatePropagation();
        this.isEditing = false;
        this.render();
        return this;
      };

      Curve.prototype.smoothedAction = function($evt) {
        console.log($evt.target);
        return this;
      };

      Curve.prototype._insertAfterMe = function(newView) {
        this.$el.after(newView.el);
        return this;
      };

      Curve.prototype.render = function() {
        this.pointsView.detachEl();
        this.linesView.detachEl();
        this.optionView.detachEl();
        this.$el.html(this.template(this.model.toJSON()));
        if (this.isEditing) {
          this.$el.append(this.pointsView.el).append(this.linesView.el).append(this.optionView.el);
        }
        return this;
      };

      Curve.prototype.onMouseOver = function() {
        this.$el.addClass('hover');
        this.highlight();
        return this;
      };

      Curve.prototype.onMouseOut = function() {
        this.$el.removeClass('hover');
        this.unhighlight();
        return this;
      };

      Curve.prototype.onSelect = function() {
        this.model.collection.trigger("selectThis", this.model);
        return this;
      };

      Curve.prototype.selected = function() {
        this.isSelected = true;
        this.$el.addClass("selected");
        this.model.get("lines").trigger("dispatchEvent", "selected");
        this.model.get("points").trigger("dispatchEvent", "selected");
        return this;
      };

      Curve.prototype.unselected = function() {
        this.isSelected = false;
        this.$el.removeClass("selected");
        this.model.get("points").trigger("dispatchEvent", "unselected");
        this.model.get("lines").trigger("dispatchEvent", "unselected");
        return this;
      };

      Curve.prototype.highlight = function() {
        this.model.get("lines").trigger("dispatchEvent", "highlight");
        this.model.get("points").trigger("dispatchEvent", "highlight");
        return this;
      };

      Curve.prototype.unhighlight = function() {
        this.model.get("points").trigger("dispatchEvent", "unhighlight");
        this.model.get("lines").trigger("dispatchEvent", "unhighlight");
        return this;
      };

      Curve.prototype.toFront = function() {
        this.model.get("lines").trigger("dispatchEvent", "toFront");
        this.model.get("points").trigger("dispatchEvent", "toFront");
        return this;
      };

      Curve.prototype.toBack = function() {
        this.model.get("points").trigger("dispatchEvent", "toBack");
        this.model.get("lines").trigger("dispatchEvent", "toBack");
        return this;
      };

      Curve.prototype.start = function() {
        this.listenTo(this.model.get("points"), "selectThis", this.onSelect);
        this.listenTo(this.model.get("lines"), "selectThis", this.onSelect);
        return this;
      };

      Curve.prototype.stop = function() {
        this.stopListening(this.model.get("points"), "selectThis");
        this.stopListening(this.model.get("lines"), "selectThis");
        return this;
      };

      return Curve;

    })(Backbone.View);
  });

}).call(this);
