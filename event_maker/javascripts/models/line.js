(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define([], function() {
    var Line;
    return Line = (function(_super) {
      __extends(Line, _super);

      function Line() {
        return Line.__super__.constructor.apply(this, arguments);
      }

      Line.prototype.defaults = function() {
        return {
          name: "Line " + (_.uniqueId())
        };
      };

      Line.prototype.destroy = function(options) {
        this.stopListening();
        return Line.__super__.destroy.call(this, options);
      };

      return Line;

    })(Backbone.Model);
  });

}).call(this);
