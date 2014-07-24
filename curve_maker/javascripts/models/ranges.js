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
        this.listenTo(this, "add", this._registerRange);
        return this;
      };

      Ranges.prototype._registerRange = function(m, c, options) {
        this.listenTo(m, {
          "change:x": this.triggerUpdated,
          "change:value": this.triggerUpdated
        });
        return this;
      };

      Ranges.prototype.triggerUpdated = function() {
        this.trigger("updated");
        return this;
      };

      Ranges.prototype.addFromJSON = function(r) {
        var newRange;
        newRange = new this.model(r);
        this.add(newRange);
        return newRange;
      };

      Ranges.prototype.getLeftRange = function() {
        return this.at(0);
      };

      Ranges.prototype.getRightRange = function() {
        return this.at(1);
      };

      Ranges.prototype.getMinRange = function() {
        if (this.length !== 0 && (this.at(0).get("value") != null)) {
          return this.min(function(m) {
            return m.get("value");
          });
        }
      };

      Ranges.prototype.getMaxRange = function() {
        if (this.length !== 0 && (this.at(0).get("value") != null)) {
          return this.max(function(m) {
            return m.get("value");
          });
        }
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

      Ranges.prototype.isReady = function() {
        return !this.canAddMore() && this.every(function(m) {
          return m.get("value") != null;
        });
      };

      Ranges.prototype.isValueValid = function(value) {
        var _ref, _ref1;
        return ((_ref = this.getMinRange()) != null ? _ref.get("value") : void 0) <= value && ((_ref1 = this.getMaxRange()) != null ? _ref1.get("value") : void 0) >= value;
      };

      Ranges.prototype.isXValid = function(x) {
        var _ref, _ref1;
        return ((_ref = this.getLeftRange()) != null ? _ref.get("x") : void 0) <= x && ((_ref1 = this.getRightRange()) != null ? _ref1.get("x") : void 0) >= x;
      };

      Ranges.prototype.getRelativeXAndValueForX = function(x) {
        var leftValue, leftX, relativeX, rightValue, rightX, value;
        leftX = this.getLeftRange().get("x");
        rightX = this.getRightRange().get("x");
        relativeX = TSCreator.utils.math.roundD6((x - leftX) / (rightX - leftX));
        leftValue = this.getLeftRange().get("value");
        rightValue = this.getRightRange().get("value");
        value = TSCreator.utils.math.roundD4(leftValue + (rightValue - leftValue) * relativeX);
        if (isNaN(value)) {
          value = null;
        }
        return [relativeX, value];
      };

      return Ranges;

    })(Backbone.Collection);
  });

}).call(this);
