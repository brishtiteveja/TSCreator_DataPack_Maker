(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define([], function() {
    var EventImage;
    return EventImage = (function(_super) {
      __extends(EventImage, _super);

      function EventImage() {
        return EventImage.__super__.constructor.apply(this, arguments);
      }

      EventImage.prototype.defaults = {
        isVisible: true,
        isPreserveAspectRatio: true
      };

      return EventImage;

    })(Backbone.Model);
  });

}).call(this);
