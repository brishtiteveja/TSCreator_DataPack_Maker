define [], () ->
  class Curve extends Backbone.Model
    defaults: () ->
      name: "Curve #{_.uniqueId()}"
