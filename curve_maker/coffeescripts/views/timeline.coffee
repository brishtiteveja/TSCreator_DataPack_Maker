define [], () ->
  class Timeline extends Backbone.View
    tagName: "div"
    className: "data-list"

    showTemplate: new EJS(url: "templates/timelines/show")
    editTemplate: new EJS(url: "templates/timelines/edit")
    template: () =>
      temp = if @isEditing then @editTemplate else @showTemplate
      temp.render.apply(temp, arguments)
    isEditing: false
    normalStrokeWidth: 2
    hoverStrokeWidth: 5

    events:
      "click .edit-btn": "editAction"
      "click .timeline-detail.showing": "editAction"
      "click .delete-btn": "deleteAction"
      "click .cancel-btn": "cancelAction"
      "change input[type=text]": "inputUpdate"
      "mouseover": "onMouseOver"
      "mouseout": "onMouseOut"
    initialize: (options) ->
      @mainCanvasView = options.mainCanvasView
      @initCanvasEl()

      @listenTo(@model,
        "highlight": @highlight
        "unhighlight": @unhighlight
        "change:y": @updateRElPositionY
      )
      @listenTo(@model,
        "_insertAfterMe": @_insertAfterMe
        "destroy": @destroy
      )

      @listenTo(@mainCanvasView,
        "start:addingTimeline": @start
        "stop:addingTimeline": @stop
      )
      @
    destroy: () =>
      @stop()
      @undelegateEvents()
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
      @rEl = @mainCanvasView.createInfiniteHorizontalPath(@model.get("y"))
      @rEl.attr("stroke": "#900000", "stroke-width": @normalStrokeWidth)
      @rEl.hover(@onMouseOver, @onMouseOut)
      @start()
      
      # Setup tooltip
      #$(@rEl.node).tooltip(
      #  content: "Hi!"
      #)
      
      @
    highlight: () =>
      @rEl.attr("stroke-width": @hoverStrokeWidth)
      @
    unhighlight: () =>
      @rEl.attr("stroke-width": @normalStrokeWidth)
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
      @_aboveTimeline = @model.getAboveTimeline()
      @_belowTimeline = @model.getBelowTimeline()
      @
    onDragMove: (dx, dy, x, y, evt) =>
      slack = 2
      locationY = @mainCanvasView.getCurrentPositionFromEvt(evt).y
      if @_aboveTimeline? and @_belowTimeline? and (@_aboveTimeline.get('y') + slack > locationY or locationY > @_belowTimeline.get('y') - slack)
        return
      if not @_aboveTimeline? and @_belowTimeline? and locationY > @_belowTimeline.get('y') - slack
        return
      if @_aboveTimeline? and not @_belowTimeline? and @_aboveTimeline.get('y') + slack > locationY
        return
      @model.set(y: locationY)
      @
    onDragEnd: (evt) =>
      delete @_aboveTimeline
      delete @_belowTimeline
      @

    toFront: () =>
      @rEl.toFront()
      @
    toBack: () =>
      @rEl.toBack()
      @
    updateRElPositionY: (m, value) =>
      @rEl.attr("path")[0][2] = value
      # use H
      #@rEl.attr("path")[1][2] = value
      @rEl.attr(path: @rEl.attr("path").toString())
      @

    start: () =>
      @rEl.drag(@onDragMove, @onDragStart, @onDragEnd)
      @toFront()
      @
    stop: () =>
      @rEl.undrag()
      @

