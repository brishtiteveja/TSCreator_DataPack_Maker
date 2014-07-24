(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["./point"], function(Point) {
    var Points;
    return Points = (function(_super) {
      __extends(Points, _super);

      function Points() {
        return Points.__super__.constructor.apply(this, arguments);
      }

      Points.prototype.model = Point;

      Points.prototype.initialize = function() {
        this.listenTo(this, "dispatchEvent", this.dispatchEvent);
        return this;
      };

      Points.prototype.comparator = "y";

      Points.prototype.dispatchEvent = function(eventName) {
        this.each(function(m) {
          return m.trigger(eventName);
        });
        return this;
      };

      Points.prototype.addWithRounding = function(obj, options) {
        var myMath;
        myMath = TSCreator.utils.math;
        if (obj.x != null) {
          obj.x = myMath.roundD4(obj.x);
        }
        if (obj.y != null) {
          obj.y = myMath.roundD4(obj.y);
        }
        return this.add(obj, options);
      };

      return Points;

    })(Backbone.Collection);
  });

}).call(this);
