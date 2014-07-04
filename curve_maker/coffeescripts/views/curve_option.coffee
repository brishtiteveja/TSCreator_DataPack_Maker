define [], () ->
  class CurveOption extends Backbone.View
    className: "display-options"
    template: new EJS(url: "templates/curves/option")
    events:
      "click .smoothed-btn": "smoothedAction"
      "click .show-points-btn": "showPointsAction"
      "click .show-lines-btn": "showLinesAction"
      "click .fill-curve-btn": "fillCurveAction"
      "change input[name=fillColor]": "fillColorAction"
    initialize: (options) ->
      @points = options.points
      @lines = options.lines
      @
    detachEl: () =>
      @$el.detach()
      @
    # Only HTML updates Model
    smoothedAction: ($evt) =>
      value = (not @model.get("isSmoothed"))
      if value
        $($evt.target).removeClass("off")
        # dispatchEvent here
        @lines.dispatchEvent("smoothing")
      else
        $($evt.target).addClass("off")
        # dispatchEvent here
        @lines.dispatchEvent("nosmoothing")
      @model.set("isSmoothed", value)
      @
    showPointsAction: ($evt) =>
      value = (not @model.get("isShowPoints"))
      if value
        $($evt.target).removeClass("off")
        @points.dispatchEvent("show")
      else
        $($evt.target).addClass("off")
        @points.dispatchEvent("hide")
      @model.set("isShowPoints", value)
      @
    showLinesAction: ($evt) =>
      value = (not @model.get("isShowLines"))
      if value
        $($evt.target).removeClass("off")
        @lines.dispatchEvent("show")
      else
        $($evt.target).addClass("off")
        @lines.dispatchEvent("hide")
      @model.set("isShowLines", value)
      @
    fillCurveAction: ($evt) =>
      value = (not @model.get("isFillCurve"))
      if value
        $($evt.target).removeClass("off")
        # dispatchEvent here
      else
        $($evt.target).addClass("off")
        # dispatchEvent here
      @model.set("isFillCurve", value)
      @
    fillColorAction: ($evt) =>
      @model.set("fillColor", $($evt.target).val())
      # trigger something
      @


    render: () =>
      @$el.html(@template.render(@model.toJSON()))
      @
