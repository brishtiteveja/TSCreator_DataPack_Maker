define ["../models/tool"], (ToolModel) ->
  class Tool extends Backbone.View
    tagName: "div"
    className: "tool"
    events:
      "click": "selectTool"
    initialize: () ->
      @listenTo(@model, "change:isActivated", @changeClassName)
      @
    selectTool: ($evt) =>
      $evt.preventDefault()
      @model.collection.trigger("selectTool", @model)
      @
    changeClassName: () =>
      if @model.get("isActivated") and not @$el.hasClass("selected")
        @$el.addClass("selected")
      else
        @$el.removeClass("selected")
      @
    render: () =>
      @$link = $("<span/>",
        class: "icon"
        title: @model.get("title")
      ).addClass(@model.get("name"))
      @$el.html(@$link)
      @
