(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["./curve", "./points", "./lines", "./curve_option"], function(Curve, Points, Lines, CurveOption) {
    var Curves;
    return Curves = (function(_super) {
      __extends(Curves, _super);

      function Curves() {
        return Curves.__super__.constructor.apply(this, arguments);
      }

      Curves.prototype.model = Curve;

      Curves.prototype.addNew = function(name) {
        var newCurve;
        newCurve = new Curve({
		  name: name,
          points: new Points(),
          lines: new Lines(),
          option: new CurveOption()
        });
        this.add(newCurve);
        return newCurve;
      };

      Curves.prototype.addWithFirstPoint = function(p) {
        var newCurve;
        newCurve = this.addNew();
        newCurve.addPointWithLine(p);
        return newCurve;
      };

      return Curves;

    })(Backbone.Collection);
  });

}).call(this);
