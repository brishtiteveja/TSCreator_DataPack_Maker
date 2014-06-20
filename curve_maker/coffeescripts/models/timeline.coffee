define [], () ->
  class Timeline extends Backbone.Model
    defaults: () ->
      {
        name: "New Timeline #{_.uniqueId()}"
        age: null
      }
    
