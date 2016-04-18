(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["./timeline"], function(Timeline) {
    var Timelines;
    return Timelines = (function(_super) {
      __extends(Timelines, _super);

      function Timelines() {
        return Timelines.__super__.constructor.apply(this, arguments);
      }

      Timelines.prototype.model = Timeline;

      Timelines.prototype.initialize = function() {
        return this;
      };

      Timelines.prototype.comparator = "y";

      Timelines.prototype.addWithRounding = function(obj, options) {
        if (obj.y != null) {
          obj.y = TSCreator.utils.math.roundD4(obj.y);
        }
        return this.add(obj, options);
      };

      Timelines.prototype.addWithZone = function(t) {
        var newTimeline;
        newTimeline = new this.model(t);
        this.addWithRounding(newTimeline, {
          withZone: true
        });
        return newTimeline;
      };

      Timelines.prototype.addFromJSON = function(t) {
        var newTimeline;
        newTimeline = new this.model(t);
        this.addWithRounding(newTimeline, {
          withZone: false
        });
        return newTimeline;
      };

      return Timelines;

    })(Backbone.Collection);
  });

}).call(this);
