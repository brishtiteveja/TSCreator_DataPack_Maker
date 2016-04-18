(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["./tool"], function(Tool) {
    var Tools;
    return Tools = (function(_super) {
      __extends(Tools, _super);

      function Tools() {
        return Tools.__super__.constructor.apply(this, arguments);
      }

      Tools.prototype.model = Tool;

      return Tools;

    })(Backbone.Collection);
  });

}).call(this);
