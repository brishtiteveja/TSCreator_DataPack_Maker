(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define([], function() {
    var Tool;
    return Tool = (function(_super) {
      __extends(Tool, _super);

      function Tool() {
        this.toggle = __bind(this.toggle, this);
        this.deactivate = __bind(this.deactivate, this);
        this.activate = __bind(this.activate, this);
        this.isActivated = __bind(this.isActivated, this);
        return Tool.__super__.constructor.apply(this, arguments);
      }

      Tool.prototype.defaults = {
        isActivated: false
      };

      Tool.prototype.isActivated = function() {
        return this.get("isActivated");
      };

      Tool.prototype.activate = function() {
        return this.set({
          isActivated: true
        });
      };

      Tool.prototype.deactivate = function() {
        return this.set({
          isActivated: false
        });
      };

      Tool.prototype.toggle = function() {
        this.set({
          isActivated: !this.get("isActivated")
        });
        return this.get("isActivated");
      };

      return Tool;

    })(Backbone.Model);
  });

}).call(this);
