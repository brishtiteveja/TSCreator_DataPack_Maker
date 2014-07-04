define ["./timeline"], (Timeline) ->
  class Timelines extends Backbone.Collection
    model: Timeline
    initialize: () ->
      @
    comparator: "y"
    addWithRounding: (obj) =>
      obj.y = Math.round(obj.y) if obj.y?
      @add(obj)
      @
