define ["../models/detail", "../models/details", "./detail"], (DetailModel, DetailCollection, DetailView) ->
  class Details extends Backbone.View
    tagName: "div"
    initialize: (options) ->
      @collection = new DetailCollection()
      @listenTo(@collection, "add", @addOne)

      # Main Canvas, Timelines, and Zones are available for all detailViews
      @mainCanvasView = options.mainCanvasView
      @columnManager = options.columnManager
      
      @collection.add(@columnManager.getCurrentModulesForDetails())
      
      @
    addOne: (m) =>
      newDetailPanelView = if m.get("viewClazz")?
        clazz = m.get("viewClazz")
        new clazz(
          model: m
          mainCanvasView: @mainCanvasView
          columnManager: @columnManager
        ).render()
      else
        new DetailView(
          model: m
          mainCanvasView: @mainCanvasView
          columnManager: @columnManager
        ).render()
      @$el.append(newDetailPanelView.el)
      @
    activateDetail: () =>
      @
    resize: (dimension) =>
      @$el.css(dimension)
      @

