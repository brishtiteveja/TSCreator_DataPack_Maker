define ["./point"], (Point) ->
  class Points extends Backbone.Collection
    model: Point
    initialize: () ->
      @listenTo(@, "dispatchEvent", @dispatchEvent)
      @
    comparator: "y"
    dispatchEvent: (eventName) ->
      @each((m) -> m.trigger(eventName))
      @
    addWithRounding: (obj) ->
      obj.x = Math.round(obj.x) if obj.x?
      obj.y = Math.round(obj.y) if obj.y?
      @add(obj)
      @
