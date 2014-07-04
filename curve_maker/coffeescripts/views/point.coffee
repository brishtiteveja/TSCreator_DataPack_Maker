define [], () ->
  class Point extends Backbone.View
    tagName: "div"
    className: "data-list"

    showTemplate: new EJS(url: "templates/points/show")
    editTemplate: new EJS(url: "templates/points/edit")
    template: () =>
      temp = if @isEditing then @editTemplate else @showTemplate
      temp.render.apply(temp, arguments)
    isEditing: false
    normalRadius: 2.5
    hoverRadius: 5
    isSelected: false
    normalColor: "#000000"
    selectedColor: "#FA3030"

    events:
      "click .sublist-edit-btn": "editAction"
      "click .point-detail.showing": "editAction"
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
        "change:x": @updateRElPosition
        "change:y": @updateRElPosition
      )
      @listenTo(@model,
        "change:x": @render
        "change:y": @render
      )
      @listenTo(@mainCanvasView,
        "start:addingCurve": @start
        "stop:addingCurve": @stop
      )
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
    _insertAfterMe: (newView) =>
      @$el.after(newView.el)
      @
    render: () =>
      @$el.html(@template(@model.toJSON()))
      @


    # rEl setup
    initCanvasEl: () ->
      @rEl = @mainCanvasView.createCircle(@model.get("x"), @model.get("y"), @normalRadius)
      @rEl.attr(
        stroke: @normalColor
        "stroke-width": 0
        fill: @normalColor
        "fill-opacity": 1
      )
      @rEl.hover(@onMouseOver, @onMouseOut)
      
      # Setup tooltip
      #$(@rEl.node).tooltip(
      #  content: "Hi!"
      #)
      @

    onMouseOver: () =>
      @$el.addClass('hover')
      @highlight()
      #$(@rEl.node).tooltip("open")
      @
    onMouseOut: () =>
      @$el.removeClass('hover')
      @unhighlight()
      #$(@rEl.node).tooltip("close")
      @
    onDragStart: (x, y, evt) =>
      @_abovePoint = @model.getAbovePoint()
      @_belowPoint = @model.getBelowPoint()
      @
    onDragMove: (dx, dy, x, y, evt) =>
      slack = 1
      position = @mainCanvasView.getCurrentPositionFromEvt(evt)
      locationX = position.x
      locationY = position.y
      if @_abovePoint? and @_belowPoint? and (@_abovePoint.get('y') + slack > locationY or locationY > @_belowPoint.get('y') - slack)
        return
      if not @_abovePoint? and @_belowPoint? and locationY > @_belowPoint.get('y') - slack
        return
      if @_abovePoint? and not @_belowPoint? and @_abovePoint.get('y') + slack > locationY
        return
      @model.set(x: locationX, y: locationY)
      @
    onDragEnd: (evt) =>
      delete @_abovePoint
      delete @_belowPoint
      @
    onSelect: (evt) =>
      evt.stopImmediatePropagation()
      @model.collection.trigger("selectThis")
      @


    selected: () =>
      @isSelected = true
      @rEl.attr(fill: @selectedColor)
      @rEl.drag(@onDragMove, @onDragStart, @onDragEnd)
      @toFront()
      @
    unselected: () =>
      @isSelected = false
      @rEl.undrag()
      @rEl.attr(fill: @normalColor)
      @
    highlight: () =>
      @rEl.attr(r: @hoverRadius)
      @
    unhighlight: () =>
      @rEl.attr(r: @normalRadius)
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
    updateRElPosition: (m) =>
      @rEl.attr(cx: m.get("x"), cy: m.get("y"))
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

