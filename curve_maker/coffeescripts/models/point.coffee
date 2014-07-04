define [], () ->
  class Point extends Backbone.Model
    defaults: () ->
      name: "Point #{_.uniqueId()}"
    getAbovePoint: () ->
      @collection.at(@collection.indexOf(@) - 1)
    getBelowPoint: () ->
      @collection.at(@collection.indexOf(@) + 1)
    
