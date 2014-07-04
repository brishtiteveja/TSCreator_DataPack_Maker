define ["../utils/curve_smoothing"], (CurveSmoothingUtils) ->
  class Line extends Backbone.View
    tagName: "div"
    className: "data-list"

    showTemplate: new EJS(url: "templates/lines/show")
    editTemplate: new EJS(url: "templates/lines/edit")
    template: () =>
      temp = if @isEditing then @editTemplate else @showTemplate
      temp.render.apply(temp, arguments)
    isEditing: false
    isSelected: false
    normalColor: "#000000"
    normalStrokeWidth: 2
    selectedColor: "#FA3030"
    hoverStrokeWidth: 4

    events:
      "click .sublist-edit-btn": "editAction"
      "click .line-detail.showing": "editAction"
      "click .delete-btn": "deleteAction"
      "click .sublist-cancel-btn": "cancelAction"
      "change input[type=text]": "inputUpdate"
      "mouseover": "onMouseOver"
      "mouseout": "onMouseOut"
    initialize: (options) ->
      @mainCanvasView = options.mainCanvasView
      @initCanvasEl()
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
        "show": @show
        "hide": @hide
        "toFront": @toFront
        "toBack": @toBack
      )
      @listenTo(@model,
        "change:above": @abovePointChanged
        "change:below": @belowPointChanged
      )
      @registerPointToUpdate(@model.get("above"))
      @registerPointToUpdate(@model.get("below"))
      @listenTo(@mainCanvasView,
        "start:addingCurve": @start
        "stop:addingCurve": @stop
      )

      # TODO: debug..
      new CurveSmoothingUtils()

      @
    registerPointToUpdate: (p) =>
      @listenTo(p, "change:x", @updateRElPosition)
      @listenTo(p, "change:y", @updateRElPosition)
      @
    unregisterPointToUpdate: (p) =>
      @stopListening(p, "change:x", @updateRElPosition)
      @stopListening(p, "change:y", @updateRElPosition)
      @
    destroy: () =>
      @undelegateEvents()
      @stop()
      @rEl.remove()
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
      @model.destroy
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
    _insertAfterMe: (newView) =>
      @$el.after(newView.el)
      @
    render: () =>
      @$el.html(@template(@model.toJSON()))
      @


    # rEl setup
    initCanvasEl: () ->
      @rEl = @mainCanvasView.createStraightLine(@model.get("above").attributes, @model.get("below").attributes)
      @rEl.attr(
        stroke: @normalColor
        "stroke-width": @normalStrokeWidth
        #fill: @normalColor
        #"fill-opacity": 1
      )
      @rEl.hover(@onMouseOver, @onMouseOut)
      @

    onMouseOver: () =>
      @$el.addClass('hover')
      @highlight()
      @
    onMouseOut: () =>
      @$el.removeClass('hover')
      @unhighlight()
      @
    onSelect: (evt) =>
      evt.stopImmediatePropagation()
      @model.collection.trigger("selectThis")
      @


    selected: () =>
      @isSelected = true
      @rEl.attr(stroke: @selectedColor)
      @toFront()
      @
    unselected: () =>
      @isSelected = false
      @rEl.undrag()
      @rEl.attr(stroke: @normalColor)
      @
    highlight: () =>
      @rEl.attr("stroke-width": @hoverStrokeWidth)
      @
    unhighlight: () =>
      @rEl.attr("stroke-width": @normalStrokeWidth)
      @
    show: () =>
      @rEl.show()
      @
    hide: () =>
      @rEl.hide()
      @
    toFront: () =>
      @rEl.toFront()
      @
    toBack: () =>
      @rEl.toBack()
      @
    abovePointChanged: (m, newP, options) =>
      @unregisterPointToUpdate(m.previous("above"))
      @registerPointToUpdate(newP)
      @updateRElPosition()
      @
    belowPointChanged: (m, newP, options) =>
      # Note: below gets never updated for current implementation
      @unregisterPointToUpdate(m.previous("below"))
      @registerPointToUpdate(newP)
      @updateRElPosition()
      @
    updateRElPosition: (p, value, options) =>
      @rEl.attr("path")[0][1] = @model.get("above").get("x")
      @rEl.attr("path")[0][2] = @model.get("above").get("y")
      @rEl.attr("path")[1][1] = @model.get("below").get("x")
      @rEl.attr("path")[1][2] = @model.get("below").get("y")
      @rEl.attr(path: @rEl.attr("path").toString())
      @

    start: () =>
      # Dragging is moved to "selected" and "unselected" events
      #@rEl.drag(@onDragMove, @onDragStart, @onDragEnd)
      @rEl.dblclick(@onSelect)
      @
    stop: () =>
      @rEl.undblclick()
      #@rEl.undrag()
      @

