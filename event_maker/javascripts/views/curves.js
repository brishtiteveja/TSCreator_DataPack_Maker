(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["./detail", "./curve", "./points"], function(Detail, CurveView, PointsView) {
    var Curves;
    return Curves = (function(_super) {
      __extends(Curves, _super);

      function Curves() {
        this.addingChild = __bind(this.addingChild, this);
        this.stop = __bind(this.stop, this);
        this.start = __bind(this.start, this);
        this.deselectCurrentIfExists = __bind(this.deselectCurrentIfExists, this);
        this.selectThis = __bind(this.selectThis, this);
        this.render = __bind(this.render, this);
        this.removeOne = __bind(this.removeOne, this);
        this.addOne = __bind(this.addOne, this);
        return Curves.__super__.constructor.apply(this, arguments);
      }

      Curves.prototype.className = "detail-panel";

      Curves.prototype.initialize = function(options) {
        Curves.__super__.initialize.call(this, options);
        this.zones = this.columnManager.retrieveDataForCurrentColumn("zones");
        this.ranges = this.columnManager.retrieveDataForCurrentColumn("ranges");
        this.notifier = this.columnManager.getNotifier();
        this.curves = this.columnManager.retrieveDataForCurrentColumn("curves");
        this.listenTo(this.curves, {
          "add": this.addOne,
          "remove": this.removeOne,
          "selectThis": this.selectThis
        });
        this.overlay = this.mainCanvasView.createInfiniteOverlay();
        this.listenTo(this.mainCanvasView, {
          "start:addingCurve": this.start,
          "stop:addingCurve": this.stop
        });
        return this;
      };

      Curves.prototype.addOne = function(m, c, options) {
        var i, newChildView;
        newChildView = new CurveView({
          model: m,
          columnManager: this.columnManager,
          mainCanvasView: this.mainCanvasView
        }).render();
        i = this.curves.indexOf(m);
        if (i === 0) {
          this.$el.prepend(newChildView.el);
        } else {
          this.curves.at(i - 1).trigger("_insertAfterMe", newChildView);
        }
        return this;
      };

      Curves.prototype.removeOne = function(m, c, options) {
        if (m === this.currentCurve) {
          this.deselectCurrentIfExists();
        }
        return this;
      };

      Curves.prototype.render = function() {
        _.each(this.curves, this.addOne);
        return this;
      };

      Curves.prototype.selectThis = function(m) {
        var isSelectingNew;
        isSelectingNew = this.currentCurve !== m;
        this.deselectCurrentIfExists();
        if (isSelectingNew) {
          m.trigger("selected");
          this.currentCurve = m;
        }
        return this;
      };

      Curves.prototype.deselectCurrentIfExists = function() {
        if (this.currentCurve != null) {
          this.currentCurve.trigger("unselected");
          delete this.currentCurve;
        }
        return this;
      };

      Curves.prototype.start = function() {
        this.overlay.toFront();
        this.overlay.dblclick(this.addingChild);
        this.curves.each(function(m) {
          return m.trigger("toFront");
        });
        return this;
      };

      Curves.prototype.stop = function() {
        this.overlay.toBack();
        this.overlay.undblclick(this.addingChild);
        this.deselectCurrentIfExists();
        return this;
      };

      Curves.prototype.addingChild = function(evt, clientX, clientY) {
        var age, newCurve, p, position, relativeX, relativeY, value, zone, _ref, _ref1;
        position = this.mainCanvasView.getCurrentPositionFromEvt(evt);
        if (this.ranges.isXValid(position.x) && this.zones.isYValid(position.y)) {
          _ref = this.ranges.getRelativeXAndValueForX(position.x), relativeX = _ref[0], value = _ref[1];
          _ref1 = this.zones.getZoneAndRelativeYAndAgeForY(position.y), zone = _ref1[0], relativeY = _ref1[1], age = _ref1[2];
          p = {
            x: position.x,
            y: position.y,
            relX: relativeX,
            value: value,
            relY: relativeY,
            zone: zone,
            age: age
          };
          if (this.currentCurve != null) {
            this.currentCurve.get("points").addWithRounding(p, {
              withLine: true
            });
            this.currentCurve.trigger("selected");
          } else {
            newCurve = this.curves.addWithFirstPoint(p);
//            this.selectThis(newCurve);
          }
        } else {
          this.notifier.trigger("showInfo", "The point is invalid.", 500);
        }
        return this;
      };

      return Curves;

    })(Detail);
  });

}).call(this);
