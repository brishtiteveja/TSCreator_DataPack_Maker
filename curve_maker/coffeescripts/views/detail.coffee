define ["../models/detail"], (DetailModel) ->
  class Detail extends Backbone.View
    tagName: "div"
    initialize: () ->
      @model.on("change:isActivated", @togglePanel)
      @
    togglePanel: () =>
      if @model.get("isActivated")
        @$el.show()
      else
        @$el.hide()
      @
    render: () =>
      @$el.html("<div>temporary! #{@model.get("name")}</div>")
      @

