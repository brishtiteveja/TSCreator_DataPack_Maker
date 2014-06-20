define ["../models/detail"], (DetailModel) ->
  class DetailButton extends Backbone.View
    tagName: "div"
    className: "detail-button"
    events:
      "click": "toggleDetail"
    initialize: () ->
      @listenTo(@model, "change:isActivated", @changeClassName)
      @
    toggleDetail: ($evt) =>
      $evt.preventDefault()
      @model.collection.trigger("toggleDetail", @model)
      @
    changeClassName: () =>
      if @model.get("isActivated") and not @$el.hasClass("selected")
        @$el.addClass("selected")
      else
        @$el.removeClass("selected")
      @
    render: () =>
      @$link = $("<span/>",
        class: "detail-button-settings-icon icon"
        title: @model.get("title")
      ).addClass(@model.get("name"))
      @$text = $("<span/>",
        class: "detail-button-text"
      ).text(@model.get("text"))
      @$el.append(@$link)
          .append(@$text)
      @
