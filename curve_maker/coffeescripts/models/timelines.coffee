define ["./timeline"], (Timeline) ->
  class Timelines extends Backbone.Collection
    model: Timeline
    initialize: () ->
      @
