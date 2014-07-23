(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define([], function() {
    var Range;
    return Range = (function(_super) {
      __extends(Range, _super);

      function Range() {
        this.stop = __bind(this.stop, this);
        this.start = __bind(this.start, this);
        this.updateRLabels = __bind(this.updateRLabels, this);
        this.updateRElPositionX = __bind(this.updateRElPositionX, this);
        this.toBack = __bind(this.toBack, this);
        this.toFront = __bind(this.toFront, this);
        this.onDragEnd = __bind(this.onDragEnd, this);
        this.onDragMove = __bind(this.onDragMove, this);
        this.onDragStart = __bind(this.onDragStart, this);
        this.onMouseOut = __bind(this.onMouseOut, this);
        this.onMouseOver = __bind(this.onMouseOver, this);
        this.unhighlight = __bind(this.unhighlight, this);
        this.highlight = __bind(this.highlight, this);
        this.render = __bind(this.render, this);
        this.inputUpdate = __bind(this.inputUpdate, this);
        this.destroy = __bind(this.destroy, this);
        return Range.__super__.constructor.apply(this, arguments);
      }

      Range.prototype.tagName = "div";

      Range.prototype.className = "range-list row";

      Range.prototype.normalStrokeWidth = 2;

      Range.prototype.hoverStrokeWidth = 5;

      Range.prototype.strokeColor = "#FF00FF";

      Range.prototype.textColor = "#FF00FF";

      Range.prototype.events = {
        "change input[type=text]": "inputUpdate",
        "mouseover": "onMouseOver",
        "mouseout": "onMouseOut"
      };

      Range.prototype.initialize = function(options) {
        this.mainCanvasView = options.mainCanvasView;
        this.initCanvasEl();
        this.template = options.template;
        this.listenTo(this.model, {
          "highlight": this.highlight,
          "unhighlight": this.unhighlight,
          "change:x": this.updateRElPositionX
        });
        this.listenTo(this.model, {
          "change:x": this.updateRLabels,
          "change:value": this.updateRLabels
        });
        this.listenTo(this.model, {
          "destroy": this.destroy
        });
        this.listenTo(this.mainCanvasView, {
          "start:addingRange": this.start,
          "stop:addingRange": this.stop
        });
        return this;
      };

      Range.prototype.destroy = function() {
        this.stop();
        this.rEl.remove();
        this.rText.remove();
        this.remove();
        return this;
      };

      Range.prototype.inputUpdate = function($evt) {
        var $input, key, value;
        $input = $($evt.target);
        key = $input.attr("name");
        value = parseFloat($input.val());
        if (!isNaN(value) && isFinite(value)) {
          this.model.set(key, value);
        } else {
          this.model.unset(key);
        }
        return this;
      };

      Range.prototype.render = function() {
        this.$el.html(this.template.render(this.model.toJSON()));
        return this;
      };

      Range.prototype.initCanvasEl = function() {
        this.rEl = this.mainCanvasView.createInfiniteVerticalPath(this.model.get("x"));
        this.rEl.attr({
          "stroke": this.strokeColor,
          "stroke-width": this.normalStrokeWidth
        });
        this.rEl.hover(this.onMouseOver, this.onMouseOut);
        this.rText = this.mainCanvasView.createText();
        this.rText.attr({
          "font-size": 16,
          fill: this.textColor
        });
        this.rTextBackground = this.mainCanvasView.createRect();
        this.rTextBackground.attr({
          "stroke": "#000000",
          "stroke-width": 0.5,
          "fill": "#FFFFFF",
          "fill-opacity": 0.9
        });
        this.updateRLabels();
        this.start();
        return this;
      };

      Range.prototype.highlight = function() {
        this.rEl.attr({
          "stroke-width": this.hoverStrokeWidth
        });
        return this;
      };

      Range.prototype.unhighlight = function() {
        this.rEl.attr({
          "stroke-width": this.normalStrokeWidth
        });
        return this;
      };

      Range.prototype.onMouseOver = function() {
        this.$el.addClass('hover');
        this.highlight();
        return this;
      };

      Range.prototype.onMouseOut = function() {
        this.$el.removeClass('hover');
        this.unhighlight();
        return this;
      };

      Range.prototype.onDragStart = function(x, y, evt) {
        if (this.model.isRight()) {
          this._leftRange = this.model.collection.getLeftRange();
        }
        if (this.model.isLeft()) {
          this._rightRange = this.model.collection.getRightRange();
        }
        return this;
      };

      Range.prototype.onDragMove = function(dx, dy, x, y, evt) {
        var locationX, slack;
        slack = 5;
        locationX = TSCreator.utils.math.roundD4(this.mainCanvasView.getCurrentPositionFromEvt(evt).x);
        if ((this._leftRange != null) && this._leftRange.get('x') + slack > locationX) {
          return;
        }
        if ((this._rightRange != null) && locationX > this._rightRange.get('x') - slack) {
          return;
        }
        this.model.set({
          x: locationX
        });
        return this;
      };

      Range.prototype.onDragEnd = function(evt) {
        delete this._leftRange;
        delete this._rightRange;
        return this;
      };

      Range.prototype.toFront = function() {
        this.rEl.toFront();
        this.rTextBackground.toFront();
        this.rText.toFront();
        return this;
      };

      Range.prototype.toBack = function() {
        this.rText.toBack();
        this.rTextBackground.toBack();
        this.rEl.toBack();
        return this;
      };

      Range.prototype.updateRElPositionX = function(m, value) {
        this.rEl.attr("path")[0][1] = value;
        this.rEl.attr({
          path: this.rEl.attr("path").toString()
        });
        return this;
      };

      Range.prototype.updateRLabels = function() {
        var cx, slackX, v, w;
        v = this.model.get("value");
        if (v != null) {
          this.rText.show();
          this.rTextBackground.show();
          cx = this.model.get("x");
          this.rText.attr({
            x: cx,
            y: 10,
            text: v
          });
          w = this.rText.getBBox().width;
          slackX = 5;
          this.rTextBackground.attr({
            x: cx - (w / 2) - slackX,
            y: 0,
            width: w + (2 * slackX),
            height: 20
          });
        } else {
          this.rText.hide();
          this.rTextBackground.hide();
        }
        return this;
      };

      Range.prototype.start = function() {
        this.rEl.drag(this.onDragMove, this.onDragStart, this.onDragEnd);
        this.toFront();
        return this;
      };

      Range.prototype.stop = function() {
        this.rEl.undrag();
        return this;
      };

      return Range;

    })(Backbone.View);
  });

}).call(this);
