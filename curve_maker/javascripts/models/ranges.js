(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["./range"], function(Range) {
    var Ranges;
    return Ranges = (function(_super) {
      __extends(Ranges, _super);

      function Ranges() {
        return Ranges.__super__.constructor.apply(this, arguments);
      }

      Ranges.prototype.model = Range;

      Ranges.prototype.maxLength = 2;

      Ranges.prototype.initialize = function() {
        this.listenTo(this, "add", this.updateName);
        return this;
      };

      Ranges.prototype.getLeftRange = function() {
        return this.at(0);
      };

      Ranges.prototype.getRightRange = function() {
        return this.at(1);
      };

      Ranges.prototype.canAddMore = function() {
        return this.length < this.maxLength;
      };

      Ranges.prototype.updateName = function(m, c, options) {
        if (m.isLeft()) {
          m.set({
            name: "Left Range Limit"
          });
        }
        if (m.isRight()) {
          m.set({
            name: "Right Range Limit"
          });
        }
        return this;
      };

      return Ranges;

    })(Backbone.Collection);
  });

}).call(this);
