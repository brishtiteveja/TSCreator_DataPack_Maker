define ["./points", "./lines", "../models/curve_option", "./curve_option"], (PointsView, LinesView, CurveOptionModel, CurveOptionView) ->
  class Curve extends Backbone.View
    tagName: "div"
    className: "data-list"

    showTemplate: new EJS(url: "templates/curves/show")
    editTemplate: new EJS(url: "templates/curves/edit")
    template: () =>
      temp = if @isEditing then @editTemplate else @showTemplate
      temp.render.apply(temp, arguments)
    isEditing: false
    isSelected: false
    normalStrokeWidth: 2
    hoverStrokeWidth: 5

    events:
      "click .edit-btn": "editAction"
      "click .delete-btn": "deleteAction"
      "click .cancel-btn": "cancelAction"
      "change input[type=text]": "inputUpdate"
      "mouseover": "onMouseOver"
      "mouseout": "onMouseOut"
    initialize: (options) ->
      @mainCanvasView = options.mainCanvasView
      @start()
      
      @listenTo(@model,
        "_insertAfterMe": @_insertAfterMe
        "destroy": @destroy
      )
      @listenTo(@model,
        "selected": @selected
        "unselected": @unselected
        "highlight": @highlight
        "unhighlight": @unhighlight
        "toFront": @toFront
        "toBack": @toBack
      )
      @listenTo(@mainCanvasView,
        "start:addingCurve": @start
        "stop:addingCurve": @stop
      )
      @_setupPointsView()
      @_setupLinesView()
      @_setupOptionView()
      @
    _setupPointsView: () ->
      @pointsView = new PointsView(
        collection: @model.get("points")
        lines: @model.get("lines")
        columnManager: @columnManager
        mainCanvasView: @mainCanvasView
      ).render()
      @
    _cleanupPointsView: () =>
      # trigger destroy on child models
      @model.get("points").trigger("destroyAll")
      @pointsView.detachEl()
      @pointsView.trigger("destroy")
      @
    _setupLinesView: () ->
      @linesView = new LinesView(
        collection: @model.get("lines")
        points: @model.get("points")
        columnManager: @columnManager
        mainCanvasView: @mainCanvasView
      ).render()
      @
    _cleanupLinesView: () =>
      @linesView.detachEl()
      @linesView.trigger("destroy")
      @
    _setupOptionView: () ->
      @model.set("option", new CurveOptionModel)
      @optionView = new CurveOptionView(
        model: @model.get("option")
        points: @model.get("points")
        lines: @model.get("lines")
      ).render()
      @
    _cleanupOptionView: () =>
      @optionView.detachEl()
      @model.get("option").destroy()
      @
    destroy: () =>
      # cleaning all points should subsequently clean up all lines
      @_cleanupPointsView()
      @_cleanupLinesView()
      @_cleanupOptionView()

      @stop()
      @undelegateEvents()
      @remove()   # calls stopListening()
      @
    inputUpdate: ($evt) =>
      $input = $($evt.target)
      key = $input.attr("name")
      value = $input.val()
      @model.set(key, value)
      @
    editAction: ($evt) =>
      $evt.stopImmediatePropagation()
      @isEditing = true
      @render()
      @
    deleteAction: ($evt) =>
      $evt.stopImmediatePropagation()
      @model.destroy()
      #  wait: true
      @
    #saveAction: () =>
    #  @isEditing = false
    #  @render()
    #  @
    cancelAction: ($evt) =>
      $evt.stopImmediatePropagation()
      @isEditing = false
      @render()
      @
    smoothedAction: ($evt) =>
      console.log $evt.target
      @
    _insertAfterMe: (newView) =>
      @$el.after(newView.el)
      @
    render: () =>
      @pointsView.detachEl()
      @linesView.detachEl()
      @optionView.detachEl()
      @$el.html(@template(@model.toJSON()))
      if @isEditing
        @$el.append(@pointsView.el)
            .append(@linesView.el)
            .append(@optionView.el)
      @


    onMouseOver: () =>
      @$el.addClass('hover')
      @highlight()
      @
    onMouseOut: () =>
      @$el.removeClass('hover')
      @unhighlight()
      @
    onSelect: () =>
      @model.collection.trigger("selectThis", @model)
      @
    

    selected: () =>
      @isSelected = true
      @$el.addClass("selected")
      @model.get("lines").trigger("dispatchEvent", "selected")
      @model.get("points").trigger("dispatchEvent", "selected")
      @
    unselected: () =>
      @isSelected = false
      @$el.removeClass("selected")
      @model.get("points").trigger("dispatchEvent", "unselected")
      @model.get("lines").trigger("dispatchEvent", "unselected")
      @
    highlight: () =>
      @model.get("lines").trigger("dispatchEvent", "highlight")
      @model.get("points").trigger("dispatchEvent", "highlight")
      @
    unhighlight: () =>
      @model.get("points").trigger("dispatchEvent", "unhighlight")
      @model.get("lines").trigger("dispatchEvent", "unhighlight")
      @
    toFront: () =>
      @model.get("lines").trigger("dispatchEvent", "toFront")
      @model.get("points").trigger("dispatchEvent", "toFront")
      @
    toBack: () =>
      @model.get("points").trigger("dispatchEvent", "toBack")
      @model.get("lines").trigger("dispatchEvent", "toBack")
      @

    start: () =>
      @listenTo(@model.get("points"), "selectThis", @onSelect)
      @listenTo(@model.get("lines"), "selectThis", @onSelect)
      @
    stop: () =>
      @stopListening(@model.get("points"), "selectThis")
      @stopListening(@model.get("lines"), "selectThis")
      @

