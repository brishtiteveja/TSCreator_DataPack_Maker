(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define([], function() {
    var Zone;
    return Zone = (function(_super) {
      __extends(Zone, _super);

      function Zone() {
        return Zone.__super__.constructor.apply(this, arguments);
      }

      Zone.prototype.defaults = function() {
        return {
          name: "Zone " + (_.uniqueId()),
          description: null,
          backgroundColor: "#FFFFFF"
        };
      };

      Zone.prototype.destroy = function(options) {
        this.stopListening();
        return Zone.__super__.destroy.call(this, options);
      };

      Zone.prototype.initialize = function(options) {
        this._registerTimeline(this.get("top"));
        this._registerTimeline(this.get("base"));
        this.listenTo(this, "change:top", this.topChanged);
        this.listenTo(this, "change:base", this.baseChanged);
        return this;
      };

      Zone.prototype.topChanged = function(m, newTimeline, options) {
        this._unregisterTimeline(m.previous("top"));
        this._registerTimeline(newTimeline);
        return this;
      };

      Zone.prototype.baseChanged = function(m, newTimeline, options) {
        this._unregisterTimeline(m.previous("base"));
        this._registerTimeline(newTimeline);
        return this;
      };

      Zone.prototype._registerTimeline = function(timeline) {
        this.listenTo(timeline, "change:y", this.triggerCollectionUpdated);
        this.listenTo(timeline, "change:age", this.triggerCollectionUpdated);
        return this;
      };

      Zone.prototype._unregisterTimeline = function(timeline) {
        this.stopListening(timeline, "change:y", this.triggerCollectionUpdated);
        this.stopListening(timeline, "change:age", this.triggerCollectionUpdated);
        return this;
      };

      Zone.prototype.triggerCollectionUpdated = function() {
        this.collection.trigger("updated", this.get("top").get("y"), this.get("base").get("y"));
        return this;
      };

      Zone.prototype.isYValid = function(y) {
        if (this.get("top").get("y") < y && this.get("base").get("y") >= y) {
          return true;
        } else if (this.collection.indexOf(this) === 0 && this.get("top").get("y") === y) {
          return true;
        } else {
          return false;
        }
      };

      Zone.prototype.getRelativeYAndAgeForY = function(y) {
        var age, baseAge, baseY, relativeY, topAge, topY;
        topY = this.get("top").get("y");
        baseY = this.get("base").get("y");
        relativeY = TSCreator.utils.math.roundD6((baseY - y) / (baseY - topY));
        topAge = this.get("top").get("age");
        baseAge = this.get("base").get("age");
        age = TSCreator.utils.math.roundD4(baseAge + (topAge - baseAge) * relativeY);
        if (isNaN(age)) {
          age = null;
        }
        return [relativeY, age];
      };

      return Zone;

    })(Backbone.Model);
  });

}).call(this);
