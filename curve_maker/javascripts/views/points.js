(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["./point"], function(PointView) {
    var Points;
    return Points = (function(_super) {
      __extends(Points, _super);

      function Points() {
        this.stop = __bind(this.stop, this);
        this.start = __bind(this.start, this);
        this.render = __bind(this.render, this);
        this.updateWrapper = __bind(this.updateWrapper, this);
        this.toggleWrapper = __bind(this.toggleWrapper, this);
        this.isShowPointsChanged = __bind(this.isShowPointsChanged, this);
        this.detachEl = __bind(this.detachEl, this);
        this.destroy = __bind(this.destroy, this);
        this.destroyAll = __bind(this.destroyAll, this);
        this.removeOne = __bind(this.removeOne, this);
        this.addOne = __bind(this.addOne, this);
        return Points.__super__.constructor.apply(this, arguments);
      }

      Points.prototype.tagName = "div";

      Points.prototype.className = "point-list";

      Points.prototype.template = new EJS({
        url: "templates/points/sublist_header"
      });

      Points.prototype.isExpanded = false;

      Points.prototype.initialize = function(options) {
        this.lines = options.lines;
        this.curveOption = options.curveOption;
        this.columnManager = options.columnManager;
        this.mainCanvasView = options.mainCanvasView;
        this.start();
        this.listenTo(this, "destroy", this.destroy);
        this.listenTo(this.curveOption, {
          "change:isShowPoints": this.isShowPointsChanged
        });
        this.listenTo(this.collection, {
          "add": this.addOne,
          "remove": this.removeOne,
          "destroyAll": this.destroyAll
        });
        this.listenTo(this.mainCanvasView, {
          "start:addingCurve": this.start,
          "stop:addingCurve": this.stop
        });
        this._setupHeader();
        return this;
      };

      Points.prototype._setupHeader = function() {
        this.$header = $(this.template.render());
        this.$header.click(this.toggleWrapper);
        return this;
      };

      Points.prototype._cleanupHeader = function() {
        this.$header.unbind().remove();
        return this;
      };

      Points.prototype.addOne = function(m, c, options) {
        var i, newChildView;
        newChildView = new PointView({
          model: m,
          mainCanvasView: this.mainCanvasView,
          columnManager: this.columnManager,
          curveOption: this.curveOption
        }).render();
        i = this.collection.indexOf(m);
        if (i === 0) {
          this.$header.after(newChildView.el);
        } else {
          this.collection.at(i - 1).trigger("_insertAfterMe", newChildView);
        }
        this.updateWrapper();
        if (options.withLine) {
          this.lines.trigger("addingLine", this.collection.at(i - 2), this.collection.at(i - 1), this.collection.at(i), this.collection.at(i + 1), this.collection.at(i + 2));
        }
        return this;
      };

      Points.prototype.removeOne = function(m, c, options) {
        var prevI;
        prevI = options.index;
        this.lines.trigger("removingLine", this.collection.at(prevI - 2), this.collection.at(prevI - 1), m, this.collection.at(prevI), this.collection.at(prevI + 1));
        return this;
      };

      Points.prototype.destroyAll = function() {
        while (this.collection.at(0) != null) {
          this.collection.at(0).destroy();
        }
        return this;
      };

      Points.prototype.destroy = function() {
        this.stop();
        this._cleanupHeader();
        this.remove();
        return this;
      };

      Points.prototype.detachEl = function() {
        this.$el.detach();
        return this;
      };

      Points.prototype.isShowPointsChanged = function(m, value, options) {
        if (value) {
          this.collection.dispatchEvent("show");
        } else {
          this.collection.dispatchEvent("hide");
        }
        return this;
      };

      Points.prototype.toggleWrapper = function() {
        this.isExpanded = !this.isExpanded;
        this.updateWrapper();
        return this;
      };

      Points.prototype.updateWrapper = function(evt) {
        if (this.isExpanded) {
          this.$el.children().not(this.$header).show();
        } else {
          this.$el.children().not(this.$header).hide();
        }
        return this;
      };

      Points.prototype.render = function() {
        this.$el.html(this.$header);
        this.collection.each(this.addOne);
        this.updateWrapper();
        return this;
      };

      Points.prototype.start = function() {
        return this;
      };

      Points.prototype.stop = function() {
        return this;
      };

      return Points;

    })(Backbone.View);
  });

}).call(this);
