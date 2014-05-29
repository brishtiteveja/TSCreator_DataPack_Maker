(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["../models/detail"], function(DetailModel) {
    var DetailButton;
    return DetailButton = (function(_super) {
      __extends(DetailButton, _super);

      function DetailButton() {
        return DetailButton.__super__.constructor.apply(this, arguments);
      }

      DetailButton.prototype.tagName = "div";

      return DetailButton;

    })(Backbone.View);
  });

}).call(this);
