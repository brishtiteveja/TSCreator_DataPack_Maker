(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["./zone"], function(Zone) {
    var Zones;
    return Zones = (function(_super) {
      __extends(Zones, _super);

      function Zones() {
        this.addingZone = __bind(this.addingZone, this);
        return Zones.__super__.constructor.apply(this, arguments);
      }

      Zones.prototype.model = Zone;

      Zones.prototype.initialize = function() {
        this.listenTo(this, {
          "addingZone": this.addingZone,
          "removingZone": this.removingZone
        });
        return this;
      };

      Zones.prototype.comparator = function(m) {
        return m.get("base").get("y");
      };

      Zones.prototype.addingZone = function(above, timeline, below) {
        var z;
        if (timeline == null) {
          return;
        }
        if ((above != null) && (below != null)) {
          z = this.findWhere({
            top: above,
            base: below
          });
          z.set({
            top: timeline
          });
          this.add({
            top: above,
            base: timeline
          });
          this.trigger("updated", above.get("y"), below.get("y"));
        } else if ((above == null) && (below != null)) {
          this.add({
            top: timeline,
            base: below
          });
          this.trigger("updated", timeline.get("y"), below.get("y"));
        } else if ((above != null) && (below == null)) {
          this.add({
            top: above,
            base: timeline
          });
          this.trigger("updated", above.get("y"), timeline.get("y"));
        }
        return this;
      };

      Zones.prototype.removingZone = function(above, timeline, below) {
        var z, z1, z2;
        if (timeline == null) {
          return;
        }
        if ((above != null) && (below != null)) {
          z1 = this.findWhere({
            top: above,
            base: timeline
          });
          z2 = this.findWhere({
            top: timeline,
            base: below
          });
          z1.destroy();
          z2.set({
            top: above
          });
          this.trigger("updated", above.get("y"), below.get("y"));
        } else if ((above == null) && (below != null)) {
          z = this.findWhere({
            top: timeline,
            base: below
          });
          z.destroy();
          this.trigger("updated", timeline.get("y"), below.get("y"));
        } else if ((above != null) && (below == null)) {
          z = this.findWhere({
            top: above,
            base: timeline
          });
          z.destroy();
          this.trigger("updated", above.get("y"), timeline.get("y"));
        }
        return this;
      };

      Zones.prototype.addFromJSON = function(timelines, zone) {
        zone.top = timelines.findWhere({
          y: zone.top.y
        });
        zone.base = timelines.findWhere({
          y: zone.base.y
        });
        return this.add(zone);
      };

      Zones.prototype.isYValid = function(y) {
        var _ref, _ref1;
        return ((_ref = this.first()) != null ? _ref.get("top").get("y") : void 0) <= y && ((_ref1 = this.last()) != null ? _ref1.get("base").get("y") : void 0) >= y;
      };

      Zones.prototype.getZoneAndRelativeYAndAgeForY = function(y) {
        var age, relativeY, zone, _ref;
        zone = this.find(function(z) {
          return z.isYValid(y);
        });
        if (zone != null) {
          _ref = zone.getRelativeYAndAgeForY(y), relativeY = _ref[0], age = _ref[1];
          return [zone, relativeY, age];
        } else {
          return [null, null, null];
        }
      };

      Zones.prototype.printAll = function() {
        console.log(this.map(function(m) {
          return "" + (m.get("name")) + "(T:" + (m.get("top").get("name")) + ", B:" + (m.get("base").get("name")) + ")";
        }).join(" -> "));
        return this;
      };

      return Zones;

    })(Backbone.Collection);
  });

}).call(this);
