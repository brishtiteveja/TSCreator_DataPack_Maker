(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["../utils/curve_smoothing"], function(CurveSmoothingUtils) {
    var Line;
    return Line = (function(_super) {
      __extends(Line, _super);

      function Line() {
        this.stop = __bind(this.stop, this);
        this.start = __bind(this.start, this);
        this.updateREl = __bind(this.updateREl, this);
        this.beyondBelowPointChanged = __bind(this.beyondBelowPointChanged, this);
        this.belowPointChanged = __bind(this.belowPointChanged, this);
        this.abovePointChanged = __bind(this.abovePointChanged, this);
        this.beyondAbovePointChanged = __bind(this.beyondAbovePointChanged, this);
        this.toBack = __bind(this.toBack, this);
        this.toFront = __bind(this.toFront, this);
        this.hide = __bind(this.hide, this);
        this.show = __bind(this.show, this);
        this.unhighlight = __bind(this.unhighlight, this);
        this.highlight = __bind(this.highlight, this);
        this.unselected = __bind(this.unselected, this);
        this.selected = __bind(this.selected, this);
        this.onSelect = __bind(this.onSelect, this);
        this.onMouseOut = __bind(this.onMouseOut, this);
        this.onMouseOver = __bind(this.onMouseOver, this);
        this.render = __bind(this.render, this);
        this._insertAfterMe = __bind(this._insertAfterMe, this);
        this.cancelAction = __bind(this.cancelAction, this);
        this.deleteAction = __bind(this.deleteAction, this);
        this.editAction = __bind(this.editAction, this);
        this.inputUpdate = __bind(this.inputUpdate, this);
        this.destroy = __bind(this.destroy, this);
        this.nosmoothing = __bind(this.nosmoothing, this);
        this.smoothing = __bind(this.smoothing, this);
        this.unregisterPointToUpdate = __bind(this.unregisterPointToUpdate, this);
        this.registerPointToUpdate = __bind(this.registerPointToUpdate, this);
        this.template = __bind(this.template, this);
        return Line.__super__.constructor.apply(this, arguments);
      }

      Line.prototype.tagName = "div";

      Line.prototype.className = "data-list";

      Line.prototype.showTemplate = new EJS({
        url: "templates/lines/show"
      });

      Line.prototype.editTemplate = new EJS({
        url: "templates/lines/edit"
      });

      Line.prototype.template = function() {
        var temp;
        temp = this.isEditing ? this.editTemplate : this.showTemplate;
        return temp.render.apply(temp, arguments);
      };

      Line.prototype.isEditing = false;

      Line.prototype.isSelected = false;

      Line.prototype.normalColor = "#000000";

      Line.prototype.normalStrokeWidth = 2;

      Line.prototype.selectedColor = "#FA3030";

      Line.prototype.hoverStrokeWidth = 4;

      Line.prototype.events = {
        "click .sublist-edit-btn": "editAction",
        "click .line-detail.showing": "editAction",
        "click .delete-btn": "deleteAction",
        "click .sublist-cancel-btn": "cancelAction",
        "change input[type=text]": "inputUpdate",
        "mouseover": "onMouseOver",
        "mouseout": "onMouseOut"
      };

      Line.prototype.initialize = function(options) {
        this.mainCanvasView = options.mainCanvasView;
        this.points = options.points;
        this.isSmoothed = options.curveOption.get("isSmoothed");
        this.initCanvasEl();
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
          "show": this.show,
          "hide": this.hide,
          "toFront": this.toFront,
          "toBack": this.toBack,
          "smoothing": this.smoothing,
          "nosmoothing": this.nosmoothing
        });
        this.listenTo(this.model, {
          "change:beyondAbove": this.beyondAbovePointChanged,
          "change:above": this.abovePointChanged,
          "change:below": this.belowPointChanged,
          "change:beyondBelow": this.beyondBelowPointChanged
        });
        if (this.model.get("beyondAbove") != null) {
          this.registerPointToUpdate(this.model.get("beyondAbove"));
        }
        this.registerPointToUpdate(this.model.get("above"));
        this.registerPointToUpdate(this.model.get("below"));
        if (this.model.get("beyondBelow") != null) {
          this.registerPointToUpdate(this.model.get("beyondBelow"));
        }
        this.listenTo(this.mainCanvasView, {
          "start:addingCurve": this.start,
          "stop:addingCurve": this.stop
        });
        return this;
      };

      Line.prototype.registerPointToUpdate = function(p) {
        this.listenTo(p, "change:x", this.updateREl);
        this.listenTo(p, "change:y", this.updateREl);
        return this;
      };

      Line.prototype.unregisterPointToUpdate = function(p) {
        this.stopListening(p, "change:x", this.updateREl);
        this.stopListening(p, "change:y", this.updateREl);
        return this;
      };

      Line.prototype.smoothing = function() {
        this.isSmoothed = true;
        this.updateREl();
        return this;
      };

      Line.prototype.nosmoothing = function() {
        this.isSmoothed = false;
        this.updateREl();
        return this;
      };

      Line.prototype.destroy = function() {
        this.stop();
        this.rEl.remove();
        this.remove();
        return this;
      };

      Line.prototype.inputUpdate = function($evt) {
        var $input, key, value;
        $input = $($evt.target);
        key = $input.attr("name");
        value = $input.val();
        this.model.set(key, value);
        return this;
      };

      Line.prototype.editAction = function($evt) {
        $evt.stopImmediatePropagation();
        this.isEditing = true;
        this.render();
        return this;
      };

      Line.prototype.deleteAction = function($evt) {
        $evt.stopImmediatePropagation();
        this.model.destroy;
        return this;
      };

      Line.prototype.cancelAction = function($evt) {
        $evt.stopImmediatePropagation();
        this.isEditing = false;
        this.render();
        return this;
      };

      Line.prototype._insertAfterMe = function(newView) {
        this.$el.after(newView.el);
        return this;
      };

      Line.prototype.render = function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
      };

      Line.prototype.initCanvasEl = function() {
        this.rEl = this.mainCanvasView.createStraightLine(this.model.get("above").attributes, this.model.get("below").attributes);
        this.rEl.attr({
          stroke: this.normalColor,
          "stroke-width": this.normalStrokeWidth
        });
        this.rEl.hover(this.onMouseOver, this.onMouseOut);
        this.updateREl();
        return this;
      };

      Line.prototype.onMouseOver = function() {
        this.$el.addClass('hover');
        this.highlight();
        return this;
      };

      Line.prototype.onMouseOut = function() {
        this.$el.removeClass('hover');
        this.unhighlight();
        return this;
      };

      Line.prototype.onSelect = function(evt) {
        evt.stopImmediatePropagation();
        this.model.collection.trigger("selectThis");
        return this;
      };

      Line.prototype.selected = function() {
        if (!this.isSelected) {
          this.isSelected = true;
          this.rEl.attr({
            stroke: this.selectedColor
          });
        }
        this.toFront();
        return this;
      };

      Line.prototype.unselected = function() {
        if (this.isSelected) {
          this.isSelected = false;
          this.rEl.attr({
            stroke: this.normalColor
          });
        }
        return this;
      };

      Line.prototype.highlight = function() {
        this.rEl.attr({
          "stroke-width": this.hoverStrokeWidth
        });
        return this;
      };

      Line.prototype.unhighlight = function() {
        this.rEl.attr({
          "stroke-width": this.normalStrokeWidth
        });
        return this;
      };

      Line.prototype.show = function() {
        this.rEl.show();
        return this;
      };

      Line.prototype.hide = function() {
        this.rEl.hide();
        return this;
      };

      Line.prototype.toFront = function() {
        this.rEl.toFront();
        return this;
      };

      Line.prototype.toBack = function() {
        this.rEl.toBack();
        return this;
      };

      Line.prototype.beyondAbovePointChanged = function(m, newP, options) {
        if (m.previous("beyondAbove") != null) {
          this.unregisterPointToUpdate(m.previous("beyondAbove"));
        }
        if (newP != null) {
          this.registerPointToUpdate(newP);
        }
        this.updateREl();
        return this;
      };

      Line.prototype.abovePointChanged = function(m, newP, options) {
        this.unregisterPointToUpdate(m.previous("above"));
        this.registerPointToUpdate(newP);
        this.updateREl();
        return this;
      };

      Line.prototype.belowPointChanged = function(m, newP, options) {
        this.unregisterPointToUpdate(m.previous("below"));
        this.registerPointToUpdate(newP);
        this.updateREl();
        return this;
      };

      Line.prototype.beyondBelowPointChanged = function(m, newP, options) {
        if (m.previous("beyondBelow") != null) {
          this.unregisterPointToUpdate(m.previous("beyondBelow"));
        }
        if (newP != null) {
          this.registerPointToUpdate(newP);
        }
        this.updateREl();
        return this;
      };

      Line.prototype.updateREl = function(p, value, options) {
        var controlPoint1, controlPoint2, i, lineTo1, lineTo2, pathStr, x1, x2, y1, y2;
        x1 = this.model.get("above").get("x");
        y1 = this.model.get("above").get("y");
        x2 = this.model.get("below").get("x");
        y2 = this.model.get("below").get("y");
        pathStr = this.isSmoothed ? (i = this.points.indexOf(this.model.get("below")), lineTo1 = i - 1 === 0, lineTo2 = i === (this.points.length - 1), controlPoint1 = TSCreator.utils.curvesmoothing.getControlPointForVerticalCurves(this.points, lineTo1, i - 1, 1), controlPoint2 = TSCreator.utils.curvesmoothing.getControlPointForVerticalCurves(this.points, lineTo2, i, -1), "M" + x1 + "," + y1 + " C" + controlPoint1[0] + "," + controlPoint1[1] + " " + controlPoint2[0] + "," + controlPoint2[1] + " " + x2 + "," + y2) : "M" + x1 + "," + y1 + "L" + x2 + "," + y2;
        this.rEl.attr({
          path: pathStr
        });
        return this;
      };

      Line.prototype.start = function() {
        this.rEl.dblclick(this.onSelect);
        return this;
      };

      Line.prototype.stop = function() {
        this.rEl.undblclick();
        return this;
      };

      return Line;

    })(Backbone.View);
  });

}).call(this);
