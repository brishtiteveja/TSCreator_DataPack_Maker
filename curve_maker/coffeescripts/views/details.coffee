define ["../models/detail", "../models/details", "./detail", "./timelines", "./image_detail"], (DetailModel, DetailCollection, DetailView, TimelinesView, ImageDetailView) ->
  class Details extends Backbone.View
    tagName: "div"
    initialize: (options) ->
      @collection = new DetailCollection()
      @listenTo(@collection, "add", @addOne)
      @mainCanvasView = options.mainCanvasView
      @
    addOne: (m) =>
      newDetailPanelView = if m.get("clazz")?
        clazz = m.get("clazz")
        new clazz(
          model: m
          mainCanvasView: @mainCanvasView
        ).render()
      else
        new DetailView(
          model: m
          mainCanvasView: @mainCanvasView
        ).render()
      m.detailPanelView = newDetailPanelView
      @$el.append(newDetailPanelView.el)
      @
    activateDetail: () =>
      @
    resize: (dimension) =>
      @$el.css(dimension)
      @
    render: () =>
      @collection.add(
        name: "timeLinesDetail"
        text: "Time Lines"
        title: "Show time line details"
        clazz: TimelinesView
      )
      @collection.add(
        name: "zonesDetail"
        text: "Zones"
        title: "Show zone details"
      )
      @collection.add(
        name: "rangeDetail"
        text: "Range"
        title: "Show range limit details"
      )
      @collection.add(
        name: "curvesDetail"
        text: "Curves"
        title: "Show curve details"
      )
      @collection.add(
        name: "imagesDetail"
        text: "Image"
        title: "Set up background image"
        template: new EJS(url: "templates/image/show")
        clazz: ImageDetailView
      )
      @collection.add(
        name: "referenceColumnsDetail"
        text: "References"
        title: "Set reference columns"
      )
      @collection.add(
        name: "defaultsDetail"
        text: "Defaults"
        title: "Defaults..."
      )
      @
