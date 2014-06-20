define ["../models/detail"], (DetailModel) ->
  class Detail extends Backbone.View
    tagName: "div"
    className: "detail-panel"
    initialize: (options) ->
      # Main Canvas is available for all detailViews
      @mainCanvasView = options.mainCanvasView

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

