(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["./event_image"], function() {
    var Point;
    return Point = (function(_super) {
      __extends(Point, _super);

      function Point() {
        return Point.__super__.constructor.apply(this, arguments);
      }

      Point.prototype.defaults = function() {
        return {
          name: "Point " + (_.uniqueId()),
          eventType: "LAD"
        };
      };

      Point.prototype.destroy = function(options) {
        this.stopListening();
        return Point.__super__.destroy.call(this, options);
      };

      Point.prototype.getAbovePoint = function() {
        return this.collection.at(this.collection.indexOf(this) - 1);
      };

      Point.prototype.getBelowPoint = function() {
        return this.collection.at(this.collection.indexOf(this) + 1);
      };

      return Point;

    })(Backbone.Model);
  });

}).call(this);
