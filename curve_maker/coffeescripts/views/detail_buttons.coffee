define ["../models/detail", "../models/details", "./detail_button"], (DetailModel, DetailCollection, DetailButtonView) ->
  class DetailButtons extends Backbone.View
    tagName: "div"
    events:
      "mouseleave": "forceToRedraw"
    initialize: (options) ->
      @listenTo(@collection, "add", @addOne)
      @
    addOne: (m) =>
      newDetailButtonView = new DetailButtonView(model: m).render()
      m.detailButtonView = newDetailButtonView
      @$el.append(newDetailButtonView.el)
      @
    forceToRedraw: ($evt) =>
      # CSS Hack for Chrome to redraw after hiding scrollbar...
      @$el.hide().show(0)
      @
    resize: (dimension) =>
      @$el.css(dimension)
      @
    render: () =>
      @collection.each(@addOne)
      @
