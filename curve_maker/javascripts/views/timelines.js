(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["./detail", "../models/timelines", "./timeline"], function(Detail, TimelineCollection, TimelineView) {
    var Timelines;
    return Timelines = (function(_super) {
      __extends(Timelines, _super);

      function Timelines() {
        this.render = __bind(this.render, this);
        this.addingNewTimeline = __bind(this.addingNewTimeline, this);
        this.stop = __bind(this.stop, this);
        this.start = __bind(this.start, this);
        this.addOne = __bind(this.addOne, this);
        return Timelines.__super__.constructor.apply(this, arguments);
      }

      Timelines.prototype.initialize = function(options) {
        Timelines.__super__.initialize.call(this, options);
        this.timelines = new TimelineCollection();
        this.model.set("timelines", this.timelines);
        this.listenTo(this.timelines, "add", this.addOne);
        this.overlay = this.mainCanvasView.createInfiniteOverlay();
        this.listenTo(this.mainCanvasView, "start:addingTimeline", this.start);
        this.listenTo(this.mainCanvasView, "stop:addingTimeline", this.stop);
        return this;
      };

      Timelines.prototype.addOne = function(m) {
        var newTimelineView;
        newTimelineView = new TimelineView({
          model: m,
          mainCanvasView: this.mainCanvasView
        }).render();
        m.view = newTimelineView;
        this.$el.append(newTimelineView.el);
        return this;
      };

      Timelines.prototype.start = function() {
        this.overlay.toFront();
        this.overlay.dblclick(this.addingNewTimeline);
        console.log(this.overlay);
        return this;
      };

      Timelines.prototype.stop = function() {
        this.overlay.toBack();
        this.overlay.undblclick(this.addingNewTimeline);
        console.log(this.overlay);
        return this;
      };

      Timelines.prototype.addingNewTimeline = function(evt, clientX, clientY) {
        var position;
        position = this.mainCanvasView.getCurrentPositionFromOffset(evt.offsetX, evt.offsetY);
        this.timelines.addOneWithY(position.y);
        return this;
      };

      Timelines.prototype.render = function() {
        _.each(this.timelines, this.addOne);
        return this;
      };

      Timelines.prototype.logger = function(m, options) {
        console.log(m);
        return this;
      };

      return Timelines;

    })(Detail);
  });

}).call(this);
