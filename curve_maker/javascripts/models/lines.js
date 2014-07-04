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

      Lines.prototype.dispatchEvent = function(eventName) {
        this.each(function(m) {
          return m.trigger(eventName);
        });
        return this;
      };

      Lines.prototype.addingLine = function(above, point, below) {
        var l;
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
          this.add({
            above: above,
            below: point
          });
        } else if ((above == null) && (below != null)) {
          this.add({
            above: point,
            below: below
          });
        } else if ((above != null) && (below == null)) {
          this.add({
            above: above,
            below: point
          });
        }
        return this;
      };

      Lines.prototype.removingLine = function(above, point, below) {
        var l, l1, l2;
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
        return this;
      };

      return Lines;

    })(Backbone.Collection);
  });

}).call(this);
