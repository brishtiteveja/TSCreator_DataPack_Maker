(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define([], function() {
    var Range;
    return Range = (function(_super) {
      __extends(Range, _super);

      function Range() {
        return Range.__super__.constructor.apply(this, arguments);
      }

      Range.prototype.defaults = function() {
        return {
          name: "Range Limit " + (_.uniqueId())
        };
      };

      Range.prototype.isLeft = function() {
        return this.collection.indexOf(this) === 0;
      };

      Range.prototype.isRight = function() {
        return this.collection.indexOf(this) === 1;
      };

      return Range;

    })(Backbone.Model);
  });

}).call(this);
