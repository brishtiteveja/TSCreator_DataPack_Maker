define [], () ->
  class Timeline extends Backbone.Model
    defaults: () ->
      name: "Timeline #{_.uniqueId()}"
      age: null
    getAboveTimeline: () ->
      @collection.at(@collection.indexOf(@) - 1)
    getBelowTimeline: () ->
      @collection.at(@collection.indexOf(@) + 1)
    
