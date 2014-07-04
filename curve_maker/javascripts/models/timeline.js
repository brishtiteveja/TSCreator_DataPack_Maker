(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define([], function() {
    var Timeline;
    return Timeline = (function(_super) {
      __extends(Timeline, _super);

      function Timeline() {
        return Timeline.__super__.constructor.apply(this, arguments);
      }

      Timeline.prototype.defaults = function() {
        return {
          name: "Timeline " + (_.uniqueId()),
          age: null
        };
      };

      Timeline.prototype.getAboveTimeline = function() {
        return this.collection.at(this.collection.indexOf(this) - 1);
      };

      Timeline.prototype.getBelowTimeline = function() {
        return this.collection.at(this.collection.indexOf(this) + 1);
      };

      return Timeline;

    })(Backbone.Model);
  });

}).call(this);
