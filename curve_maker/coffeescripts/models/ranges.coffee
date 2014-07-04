define ["./range"], (Range) ->
  class Ranges extends Backbone.Collection
    model: Range
    maxLength: 2
    initialize: () ->
      @listenTo(@, "add", @updateName)
      @
    getLeftRange: () ->
      @at(0)
    getRightRange: () ->
      @at(1)
    canAddMore: () ->
      @length < @maxLength
    updateName: (m, c, options) ->
      if m.isLeft()
        m.set(name: "Left Range Limit")
      if m.isRight()
        m.set(name: "Right Range Limit")
      @
