(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define([], function() {
    var BackgroundImage;
    return BackgroundImage = (function(_super) {
      __extends(BackgroundImage, _super);

      function BackgroundImage() {
        return BackgroundImage.__super__.constructor.apply(this, arguments);
      }

      BackgroundImage.prototype.defaults = {
        isVisible: true,
        isPreserveAspectRatio: true
      };

      return BackgroundImage;

    })(Backbone.Model);
  });

}).call(this);
