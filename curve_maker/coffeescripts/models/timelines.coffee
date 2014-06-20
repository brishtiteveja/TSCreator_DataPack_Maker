define ["./timeline"], (Timeline) ->
  class Timelines extends Backbone.Collection
    model: Timeline
    initialize: () ->
      @
    addOneWithY: (y) =>
      @add
        y: Math.round(y)
      @
