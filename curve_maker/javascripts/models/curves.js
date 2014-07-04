(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["./curve", "./points", "./lines"], function(Curve, Points, Lines) {
    var Curves;
    return Curves = (function(_super) {
      __extends(Curves, _super);

      function Curves() {
        return Curves.__super__.constructor.apply(this, arguments);
      }

      Curves.prototype.model = Curve;

      Curves.prototype.addWithFirstPoint = function(p) {
        var newLines, newPoints;
        newPoints = new Points();
        newPoints.add(p);
        newLines = new Lines();
        return this.add({
          points: newPoints,
          lines: newLines
        });
      };

      return Curves;

    })(Backbone.Collection);
  });

}).call(this);
