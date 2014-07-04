define ["../models/detail"], (DetailModel) ->
  class Detail extends Backbone.View
    tagName: "div"
    className: "detail-panel"
    initialize: (options) ->
      # Main Canvas, Timelines, and Zones are available for all detailViews
      @mainCanvasView = options.mainCanvasView
      @columnManager = options.columnManager
      @timelines = @columnManager.retrieveCurrentDataModule("timelines")
      @zones = @columnManager.retrieveCurrentDataModule("zones")

      @listenTo(@model, "change:isActivated", @togglePanel)
      @template = @model.get("template") or new EJS(text: "<div>Coming soon... (<%= text %>)</div>")
      @togglePanel()   # initially hide panel 
      @
    togglePanel: () =>
      if @model.get("isActivated")
        @$el.css("display", "inline-block")
      else
        @$el.hide()
      @
    render: () =>
      @$el.html(@template.render(@model.toJSON()))
      @

