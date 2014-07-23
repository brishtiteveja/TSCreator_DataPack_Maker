(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["./line"], function(LineView) {
    var Lines;
    return Lines = (function(_super) {
      __extends(Lines, _super);

      function Lines() {
        this.stop = __bind(this.stop, this);
        this.start = __bind(this.start, this);
        this.render = __bind(this.render, this);
        this._updateWrapper = __bind(this._updateWrapper, this);
        this.toggleWrapper = __bind(this.toggleWrapper, this);
        this.isShowLinesChanged = __bind(this.isShowLinesChanged, this);
        this.isSmoothedChanged = __bind(this.isSmoothedChanged, this);
        this.detachEl = __bind(this.detachEl, this);
        this.destroy = __bind(this.destroy, this);
        this.removeOne = __bind(this.removeOne, this);
        this.addOne = __bind(this.addOne, this);
        return Lines.__super__.constructor.apply(this, arguments);
      }

      Lines.prototype.tagName = "div";

      Lines.prototype.className = "line-list";

      Lines.prototype.template = new EJS({
        url: "templates/lines/sublist_header"
      });

      Lines.prototype.isExpanded = false;

      Lines.prototype.initialize = function(options) {
        this.points = options.points;
        this.curveOption = options.curveOption;
        this.columnManager = options.columnManager;
        this.mainCanvasView = options.mainCanvasView;
        this.start();
        this.listenTo(this, "destroy", this.destroy);
        this.listenTo(this.curveOption, {
          "change:isSmoothed": this.isSmoothedChanged,
          "change:isShowLines": this.isShowLinesChanged
        });
        this.listenTo(this.collection, {
          "add": this.addOne,
          "remove": this.removeOne
        });
        this.listenTo(this.mainCanvasView, {
          "start:addingCurve": this.start,
          "stop:addingCurve": this.stop
        });
        this._setupHeader();
        return this;
      };

      Lines.prototype._setupHeader = function() {
        this.$header = $(this.template.render());
        this.$header.click(this.toggleWrapper);
        return this;
      };

      Lines.prototype._cleanupHeader = function() {
        this.$header.unbind().remove();
        return this;
      };

      Lines.prototype.addOne = function(m) {
        var i, newChildView;
        newChildView = new LineView({
          model: m,
          mainCanvasView: this.mainCanvasView,
          points: this.points,
          curveOption: this.curveOption
        }).render();
        i = this.collection.indexOf(m);
        if (i === 0) {
          this.$header.after(newChildView.el);
        } else {
          this.collection.at(i - 1).trigger("_insertAfterMe", newChildView);
        }
        this._updateWrapper();
        return this;
      };

      Lines.prototype.removeOne = function(m, c, options) {
        return this;
      };

      Lines.prototype.destroy = function() {
        this.stop();
        this._cleanupHeader();
        this.remove();
        return this;
      };

      Lines.prototype.detachEl = function() {
        this.$el.detach();
        return this;
      };

      Lines.prototype.isSmoothedChanged = function(m, value, options) {
        if (value) {
          this.collection.dispatchEvent("smoothing");
        } else {
          this.collection.dispatchEvent("nosmoothing");
        }
        return this;
      };

      Lines.prototype.isShowLinesChanged = function(m, value, options) {
        if (value) {
          this.collection.dispatchEvent("show");
        } else {
          this.collection.dispatchEvent("hide");
        }
        return this;
      };

      Lines.prototype.toggleWrapper = function() {
        this.isExpanded = !this.isExpanded;
        this._updateWrapper();
        return this;
      };

      Lines.prototype._updateWrapper = function(evt) {
        if (this.isExpanded) {
          this.$el.children().not(this.$header).show();
        } else {
          this.$el.children().not(this.$header).hide();
        }
        return this;
      };

      Lines.prototype.render = function() {
        this.$el.html(this.$header);
        this.collection.each(this.addOne);
        return this;
      };

      Lines.prototype.start = function() {
        return this;
      };

      Lines.prototype.stop = function() {
        return this;
      };

      return Lines;

    })(Backbone.View);
  });

}).call(this);
