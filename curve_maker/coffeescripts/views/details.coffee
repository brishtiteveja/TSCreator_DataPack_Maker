define ["../models/detail", "../models/details", "./detail"], (DetailModel, DetailCollection, DetailView) ->
  class Details extends Backbone.View
    tagName: "div"
    initialize: (options) ->
      @detailList = options.detailList
      @detailList.on("add", @addOne)
      @
    addOne: (m) =>
      newDetailPanelView = new DetailView(model: m).render()
      m.detailPanelView = newDetailPanelView
      @$el.append(newDetailPanelView.el)
      @
    activateDetail: () =>
      @
    render: () =>
      @detailList.add(
        name: "detail-button-time-lines"
        text: "Time Lines"
        title: "Show time line details"
      )
      @detailList.add(
        name: "detail-button-zones"
        text: "Zones"
        title: "Show zone details"
      )
      @detailList.add(
        name: "detail-button-range-lines"
        text: "Ranges"
        title: "Show range line details"
      )
      @detailList.add(
        name: "detail-button-background-image"
        text: "Image"
        title: "Set up background image"
      )
      @detailList.add(
        name: "detail-button-reference-columns"
        text: "References"
        title: "Set reference columns"
      )
      @detailList.add(
        name: "detail-button-default"
        text: "Default"
        title: "Default..."
      )
      @
