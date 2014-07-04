(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["./detail", "./range"], function(Detail, RangeView) {
    var Ranges;
    return Ranges = (function(_super) {
      __extends(Ranges, _super);

      function Ranges() {
        this.render = __bind(this.render, this);
        this.addingRange = __bind(this.addingRange, this);
        this.stop = __bind(this.stop, this);
        this.start = __bind(this.start, this);
        this.removeOne = __bind(this.removeOne, this);
        this.addOne = __bind(this.addOne, this);
        return Ranges.__super__.constructor.apply(this, arguments);
      }

      Ranges.prototype.className = "detail-panel";

      Ranges.prototype.initialize = function(options) {
        Ranges.__super__.initialize.call(this, options);
        this.ranges = this.columnManager.retrieveCurrentDataModule("ranges");
        this.listenTo(this.ranges, "add", this.addOne);
        this.listenTo(this.ranges, "remove", this.removeOne);
        this.overlay = this.mainCanvasView.createInfiniteOverlay();
        this.listenTo(this.mainCanvasView, {
          "start:addingRange": this.start,
          "stop:addingRange": this.stop
        });
        return this;
      };

      Ranges.prototype.addOne = function(m, c, options) {
        var newRangeView;
        newRangeView = new RangeView({
          model: m,
          template: this.template,
          mainCanvasView: this.mainCanvasView
        }).render();
        this.$el.append(newRangeView.el);
        return this;
      };

      Ranges.prototype.removeOne = function(m, c, options) {
        return this;
      };

      Ranges.prototype.start = function() {
        this.overlay.toFront();
        this.overlay.dblclick(this.addingRange);
        return this;
      };

      Ranges.prototype.stop = function() {
        this.overlay.toBack();
        this.overlay.undblclick(this.addingRange);
        return this;
      };

      Ranges.prototype.addingRange = function(evt, clientX, clientY) {
        var position;
        if (this.ranges.canAddMore()) {
          position = this.mainCanvasView.getCurrentPositionFromEvt(evt);
          this.ranges.add({
            x: position.x
          });
        } else {
          console.log("Cannot add more range limits");
        }
        return this;
      };

      Ranges.prototype.render = function() {
        _.each(this.ranges, this.addOne);
        return this;
      };

      return Ranges;

    })(Detail);
  });

}).call(this);
