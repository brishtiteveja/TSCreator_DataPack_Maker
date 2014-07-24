(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define([], function() {
    var Detail;
    return Detail = (function(_super) {
      __extends(Detail, _super);

      function Detail() {
        this.toggle = __bind(this.toggle, this);
        this.deactivate = __bind(this.deactivate, this);
        this.activate = __bind(this.activate, this);
        this.isActivated = __bind(this.isActivated, this);
        return Detail.__super__.constructor.apply(this, arguments);
      }

      Detail.prototype.defaults = {
        isActivated: false
      };

      Detail.prototype.destroy = function(options) {
        this.stopListening();
        return Detail.__super__.destroy.call(this, options);
      };

      Detail.prototype.isActivated = function() {
        return this.get("isActivated");
      };

      Detail.prototype.activate = function() {
        return this.set({
          isActivated: true
        });
      };

      Detail.prototype.deactivate = function() {
        return this.set({
          isActivated: false
        });
      };

      Detail.prototype.toggle = function() {
        this.set({
          isActivated: !this.get("isActivated")
        });
        return this.get("isActivated");
      };

      return Detail;

    })(Backbone.Model);
  });

}).call(this);
