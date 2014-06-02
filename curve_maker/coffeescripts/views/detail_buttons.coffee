define ["../models/detail", "../models/details", "./detail_button"], (DetailModel, DetailCollection, DetailButtonView) ->
  class DetailButtons extends Backbone.View
    tagName: "div"
    initialize: (options) ->
      @detailList = options.detailList
      @detailList.on("add", @addOne)
      @
    addOne: (m) =>
      newDetailButtonView = new DetailButtonView(model: m).render()
      m.detailButtonView = newDetailButtonView
      @$el.append(newDetailButtonView.el)
      @
