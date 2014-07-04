define [], () ->
  class Zone extends Backbone.Model
    # name
    # description
    # top
    # base

    defaults: () ->
      name: "Zone #{_.uniqueId()}"
      description: null

    
