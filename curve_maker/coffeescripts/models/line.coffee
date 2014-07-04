define [], () ->
  class Line extends Backbone.Model
    # name
    # abovePoint
    # belowPoint

    defaults: () ->
      name: "Line #{_.uniqueId()}"

    
