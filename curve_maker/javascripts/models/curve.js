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

      return Curve;

    })(Backbone.Model);
  });

}).call(this);
