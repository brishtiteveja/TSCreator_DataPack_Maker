define [], () ->
  class Range extends Backbone.Model
    defaults: () ->
      name: "Range Limit #{_.uniqueId()}"
    isLeft: () ->
      @collection.indexOf(@) is 0
    isRight: () ->
      @collection.indexOf(@) is 1
