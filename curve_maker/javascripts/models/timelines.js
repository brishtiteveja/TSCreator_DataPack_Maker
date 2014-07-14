(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["./timeline"], function(Timeline) {
    var Timelines;
    return Timelines = (function(_super) {
      __extends(Timelines, _super);

      function Timelines() {
        this.addWithRounding = __bind(this.addWithRounding, this);
        return Timelines.__super__.constructor.apply(this, arguments);
      }

      Timelines.prototype.model = Timeline;

      Timelines.prototype.initialize = function() {
        return this;
      };

      Timelines.prototype.comparator = "y";

      Timelines.prototype.addWithRounding = function(obj) {
        if (obj.y != null) {
          obj.y = Math.round(obj.y);
        }
        this.add(obj);
        return this;
      };

      return Timelines;

    })(Backbone.Collection);
  });

}).call(this);