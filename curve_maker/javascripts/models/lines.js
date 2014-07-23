(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["./line"], function(Line) {
    var Lines;
    return Lines = (function(_super) {
      __extends(Lines, _super);

      function Lines() {
        return Lines.__super__.constructor.apply(this, arguments);
      }

      Lines.prototype.model = Line;

      Lines.prototype.initialize = function() {
        this.listenTo(this, {
          "dispatchEvent": this.dispatchEvent,
          "addingLine": this.addingLine,
          "removingLine": this.removingLine
        });
        return this;
      };

      Lines.prototype.comparator = function(m) {
        return m.get("below").get("y");
      };

      Lines.prototype.destroy = function(options) {
        this.stopListening();
        return Lines.__super__.destroy.call(this, options);
      };

      Lines.prototype.dispatchEvent = function(eventName) {
        this.each(function(m) {
          return m.trigger(eventName);
        });
        return this;
      };

      Lines.prototype.addingLine = function(beyondAbove, above, point, below, beyondBelow) {
        var aboveL, belowL, l;
        if (point == null) {
          return;
        }
        if ((above != null) && (below != null)) {
          l = this.findWhere({
            above: above,
            below: below
          });
          l.set({
            above: point
          });
          l.set({
            beyondAbove: above
          });
          this.add({
            beyondAbove: beyondAbove,
            above: above,
            below: point,
            beyondBelow: below
          });
        } else if ((above == null) && (below != null)) {
          this.add({
            beyondAbove: above,
            above: point,
            below: below,
            beyondBelow: beyondBelow
          });
        } else if ((above != null) && (below == null)) {
          this.add({
            beyondAbove: beyondAbove,
            above: above,
            below: point,
            beyondBelow: below
          });
        }
        aboveL = this.findWhere({
          above: beyondAbove,
          below: above
        });
        if (aboveL != null) {
          aboveL.set({
            beyondBelow: point
          });
        }
        belowL = this.findWhere({
          above: below,
          below: beyondBelow
        });
        if (belowL != null) {
          belowL.set({
            beyondAbove: point
          });
        }
        return this;
      };

      Lines.prototype.removingLine = function(beyondAbove, above, point, below, beyondBelow) {
        var aboveL, belowL, l, l1, l2;
        if (point == null) {
          return;
        }
        if ((above != null) && (below != null)) {
          l1 = this.findWhere({
            above: above,
            below: point
          });
          l2 = this.findWhere({
            above: point,
            below: below
          });
          l1.destroy();
          l2.set({
            beyondAbove: beyondAbove
          });
          l2.set({
            above: above
          });
        } else if ((above == null) && (below != null)) {
          l = this.findWhere({
            above: point,
            below: below
          });
          l.destroy();
        } else if ((above != null) && (below == null)) {
          l = this.findWhere({
            above: above,
            below: point
          });
          l.destroy();
        }
        aboveL = this.findWhere({
          above: beyondAbove,
          below: above
        });
        if (aboveL != null) {
          aboveL.set({
            beyondBelow: below
          });
        }
        belowL = this.findWhere({
          above: below,
          below: beyondBelow
        });
        if (belowL != null) {
          belowL.set({
            beyondAbove: above
          });
        }
        return this;
      };

      return Lines;

    })(Backbone.Collection);
  });

}).call(this);
