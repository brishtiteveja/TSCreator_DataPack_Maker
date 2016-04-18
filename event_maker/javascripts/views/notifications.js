(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define([], function() {
    var Notifications;
    return Notifications = (function(_super) {
      __extends(Notifications, _super);

      function Notifications() {
        return Notifications.__super__.constructor.apply(this, arguments);
      }

      Notifications.prototype.initialize = function(options) {
        this.listenTo(this, "showInfo", this.showInfo);
        return this;
      };

      Notifications.prototype.showInfo = function(message, time) {
        var notification;
        notification = $("<div/>", {
          "class": "notification info"
        }).text(message);
        this.$el.append(notification);
        _.delay(function() {
          return notification.fadeOut("slow", function() {
            return notification.remove();
          });
        }, time || 5000);
        return this;
      };

      return Notifications;

    })(Backbone.View);
  });

}).call(this);
