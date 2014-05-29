(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["./tool"], function(Tool) {
    var Tools;
    return Tools = (function(_super) {
      __extends(Tools, _super);

      function Tools() {
        this.toggleTool = __bind(this.toggleTool, this);
        return Tools.__super__.constructor.apply(this, arguments);
      }

      Tools.prototype.model = Tool;

      Tools.prototype.activatedToolModel = null;

      Tools.prototype.initialize = function() {
        this.on("toggleTool", this.toggleTool);
        return this;
      };

      Tools.prototype.toggleTool = function(m) {
        if ((this.activatedToolModel != null) && this.activatedToolModel === m) {
          m.deactivate();
          this.activatedToolModel = null;
        } else {
          if (this.activatedToolModel != null) {
            this.activatedToolModel.deactivate();
          }
          m.activate();
          this.activatedToolModel = m;
        }
        return this;
      };

      return Tools;

    })(Backbone.Collection);
  });

}).call(this);
