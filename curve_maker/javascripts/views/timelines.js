(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["./detail", "./timeline"], function(Detail, TimelineView) {
    var Timelines;
    return Timelines = (function(_super) {
      __extends(Timelines, _super);

      function Timelines() {
        this.render = __bind(this.render, this);
        this.addingChild = __bind(this.addingChild, this);
        this.stop = __bind(this.stop, this);
        this.start = __bind(this.start, this);
        this.removeOne = __bind(this.removeOne, this);
        this.addOne = __bind(this.addOne, this);
        return Timelines.__super__.constructor.apply(this, arguments);
      }

      Timelines.prototype.className = "detail-panel inline-edit";

      Timelines.prototype.initialize = function(options) {
        Timelines.__super__.initialize.call(this, options);
        this.timelines = this.columnManager.retrieveCurrentDataModule("timelines");
        this.listenTo(this.timelines, "add", this.addOne);
        this.listenTo(this.timelines, "remove", this.removeOne);
        this.overlay = this.mainCanvasView.createInfiniteOverlay();
        this.listenTo(this.mainCanvasView, {
          "start:addingTimeline": this.start,
          "stop:addingTimeline": this.stop
        });
        return this;
      };

      Timelines.prototype.addOne = function(m, c, options) {
        var i, newChildView;
        newChildView = new TimelineView({
          model: m,
          mainCanvasView: this.mainCanvasView
        }).render();
        i = this.timelines.indexOf(m);
        if (i === 0) {
          this.$el.prepend(newChildView.el);
        } else {
          this.timelines.at(i - 1).trigger("_insertAfterMe", newChildView);
        }
        if (options.withZone) {
          this.zones.trigger("addingZone", this.timelines.at(i - 1), this.timelines.at(i), this.timelines.at(i + 1));
        }
        return this;
      };

      Timelines.prototype.removeOne = function(m, c, options) {
        var prevI;
        prevI = options.index;
        this.zones.trigger("removingZone", this.timelines.at(prevI - 1), m, this.timelines.at(prevI));
        return this;
      };

      Timelines.prototype.start = function() {
        this.overlay.toFront();
        this.overlay.dblclick(this.addingChild);
        return this;
      };

      Timelines.prototype.stop = function() {
        this.overlay.toBack();
        this.overlay.undblclick(this.addingChild);
        return this;
      };

      Timelines.prototype.addingChild = function(evt, clientX, clientY) {
        var position;
        position = this.mainCanvasView.getCurrentPositionFromEvt(evt);
        this.timelines.addWithZone({
          y: position.y
        });
        return this;
      };

      Timelines.prototype.render = function() {
        _.each(this.timelines, this.addOne);
        return this;
      };

      return Timelines;

    })(Detail);
  });

}).call(this);
