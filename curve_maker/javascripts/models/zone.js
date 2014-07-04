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
          description: null
        };
      };

      return Zone;

    })(Backbone.Model);
  });

}).call(this);
