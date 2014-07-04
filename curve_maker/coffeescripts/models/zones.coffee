define ["./zone"], (Zone) ->
  class Zones extends Backbone.Collection
    model: Zone
    initialize: () ->
      @listenTo(@,
        "addingZone": @addingZone
        "removingZone": @removingZone
      )
      @
    comparator: (m) ->
      m.get("base").get("y")

    addingZone: (above, timeline, below) =>
      return if not timeline?   # Invalid
      # Add in the middle
      if above? and below?
        z = @findWhere(top: above, base: below)
        z.set(top: timeline)
        @add(top: above, base: timeline)
      # Add top
      else if not above? and below?
        @add(top: timeline, base: below)
      # Add bottom
      else if above? and not below?
        @add(top: above, base: timeline)
      @
    removingZone: (above, timeline, below) =>
      return if not timeline?   # Invalid
      # Remove in the middle
      if above? and below?
        z1 = @findWhere(top: above, base: timeline)
        z2 = @findWhere(top: timeline, base: below)
        z1.destroy()
        z2.set(top: above)
      # Remove top
      else if not above? and below?
        z = @findWhere(top: timeline, base: below)
        z.destroy()
      # Remove bottom
      else if above? and not below?
        z = @findWhere(top: above, base: timeline)
        z.destroy()
      @

    printAll: () =>
      console.log @map((m) ->
        "#{m.get("name")}(T:#{m.get("top").get("name")}, B:#{m.get("base").get("name")})"
      ).join(" -> ")
      @
