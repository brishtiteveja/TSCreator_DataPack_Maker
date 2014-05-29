(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["../models/detail", "../models/details", "./detail_button"], function(DetailModel, DetailCollection, DetailButtonView) {
    var DetailButtons;
    return DetailButtons = (function(_super) {
      __extends(DetailButtons, _super);

      function DetailButtons() {
        return DetailButtons.__super__.constructor.apply(this, arguments);
      }

      DetailButtons.prototype.tagName = "div";

      return DetailButtons;

    })(Backbone.View);
  });

}).call(this);
