define [], () ->
  class Notifications extends Backbone.View
    initialize: (options) ->
      @listenTo(@, "showInfo", @showInfo)
      @
    showInfo: (message, time) ->
      notification = $("<div/>", class: "notification info").text(message)
      @$el.append(notification)
      _.delay(() ->
        notification.fadeOut("slow", () -> notification.remove())
      , time or 5000)
      @
      

