define ["../models/detail", "../models/details", "./detail"], (DetailModel, DetailCollection, DetailView) ->
  class Details extends Backbone.View
    tagName: "div"
    initialize: (options) ->
      @detailList = options.detailList
      @detailList.on("add", @addOne)
      @
    addOne: (m) =>
      newDetailView = new DetailView(model: m).render()
      m.detailView = newDetailView
      @$el.append(newDetailView.el)
      @
    activateDetail: () =>
      @
    render: () =>
      @detailList.add(name: "detail-button-time-lines", title: "Show time line details")
      @detailList.add(name: "detail-button-zones", title: "Show zone details")
      @detailList.add(name: "detail-button-range-lines", title: "Show range line details")
      @detailList.add(name: "detail-button-background-image", title: "Set up background image")
      @detailList.add(name: "detail-button-reference-columns", title: "Set reference columns")
      @detailList.add(name: "detail-button-default", title: "Default...")
      @
