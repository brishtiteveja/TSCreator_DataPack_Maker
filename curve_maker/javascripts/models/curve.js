(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define([], function() {
    var Curve;
    return Curve = (function(_super) {
      __extends(Curve, _super);

      function Curve() {
        return Curve.__super__.constructor.apply(this, arguments);
      }

      Curve.prototype.defaults = function() {
        return {
          name: "Curve " + (_.uniqueId())
        };
      };

      Curve.prototype.addPointWithLine = function(p) {
        this.get("points").addWithRounding(p, {
          withLine: true
        });
        return this;
      };

      Curve.prototype.addPointFromJSON = function(timelines, zones, p) {
        var base, top;
        if (p.zone != null) {
          top = timelines.findWhere({
            y: p.zone.top.y
          });
          base = timelines.findWhere({
            y: p.zone.base.y
          });
          p.zone = zones.findWhere({
            top: top,
            base: base
          });
        }
        this.get("points").addWithRounding(p, {
          withLine: false
        });
        return this;
      };

      Curve.prototype.addLineFromJSON = function(line) {
        if (line.beyondAbove != null) {
          line.beyondAbove = this.get("points").findWhere({
            x: line.beyondAbove.x,
            y: line.beyondAbove.y
          });
        }
        if (line.above != null) {
          line.above = this.get("points").findWhere({
            x: line.above.x,
            y: line.above.y
          });
        }
        if (line.below != null) {
          line.below = this.get("points").findWhere({
            x: line.below.x,
            y: line.below.y
          });
        }
        if (line.beyondBelow != null) {
          line.beyondBelow = this.get("points").findWhere({
            x: line.beyondBelow.x,
            y: line.beyondBelow.y
          });
        }
        this.get("lines").add(line);
        return this;
      };

      return Curve;

    })(Backbone.Model);
  });

}).call(this);
