define ["./line"], (Line) ->
  class Lines extends Backbone.Collection
    model: Line
    initialize: () ->
      @listenTo(@,
        "dispatchEvent": @dispatchEvent
        "addingLine": @addingLine
        "removingLine": @removingLine
      )
      @
    comparator: (m) ->
      m.get("below").get("y")
    dispatchEvent: (eventName) ->
      @each((m) -> m.trigger(eventName))
      @

    addingLine: (above, point, below) ->
      return if not point?   # Invalid
      # Add in the middle
      if above? and below?
        l = @findWhere(above: above, below: below)
        l.set(above: point)
        @add(above: above, below: point)
      # Add above
      else if not above? and below?
        @add(above: point, below: below)
      # Add bottom
      else if above? and not below?
        @add(above: above, below: point)
      @
    removingLine: (above, point, below) ->
      return if not point?   # Invalid
      # Remove in the middle
      if above? and below?
        l1 = @findWhere(above: above, below: point)
        l2 = @findWhere(above: point, below: below)
        l1.destroy()
        l2.set(above: above)
      # Remove above
      else if not above? and below?
        l = @findWhere(above: point, below: below)
        l.destroy()
      # Remove bottom
      else if above? and not below?
        l = @findWhere(above: above, below: point)
        l.destroy()
      @
