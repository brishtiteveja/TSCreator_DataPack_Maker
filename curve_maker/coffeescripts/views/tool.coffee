define ["../models/tool"], (ToolModel) ->
  class Tool extends Backbone.View
    tagName: "div"
    events:
      "click": "toggleTool"
    initialize: () ->
      @model.on("change:isActivated", @changeClassName)
      @
    toggleTool: ($evt) =>
      $evt.preventDefault()
      @model.collection.trigger("toggleTool", @model)
      @
    changeClassName: () =>
      if @model.get("isActivated") and not @$el.hasClass("selected")
        @$el.addClass("selected")
      else
        @$el.removeClass("selected")
      @
    render: () =>
      @$link = $("<span/>",
        class: "maker-tools icon"
        title: @model.get("title")
      ).addClass(@model.get("name"))
      @$el.html(@$link)
      @
