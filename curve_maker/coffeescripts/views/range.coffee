define [], () ->
  class Range extends Backbone.View
    tagName: "div"
    className: "range-list row"

    normalStrokeWidth: 2
    hoverStrokeWidth: 5
    #strokeColor: "#900000"
    strokeColor: "#FF00FF"
    textColor: "#FF00FF"

    events:
      #"click .delete-btn": "deleteAction"
      "change input[type=text]": "inputUpdate"
      "mouseover": "onMouseOver"
      "mouseout": "onMouseOut"
    initialize: (options) ->
      @mainCanvasView = options.mainCanvasView
      @initCanvasEl()
      @template = options.template

      @listenTo(@model,
        "highlight": @highlight
        "unhighlight": @unhighlight
        "change:x": @updateRElPositionX
      )
      @listenTo(@model,
        "change:x": @updateRLabels
        "change:value": @updateRLabels
      )
      @listenTo(@model,
        "destroy": @destroy
      )

      @listenTo(@mainCanvasView,
        "start:addingRange": @start
        "stop:addingRange": @stop
      )
      @
    destroy: () =>
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
    #deleteAction: ($evt) =>
    #  $evt.stopImmediatePropagation()
    #  @model.destroy()
    #  #  wait: true
    #  @
    #saveAction: () =>
    #  @isEditing = false
    #  @render()
    #  @
    render: () =>
      @$el.html(@template.render(@model.toJSON()))
      @


    # rEl setup
    initCanvasEl: () ->
      @rEl = @mainCanvasView.createInfiniteVerticalPath(@model.get("x"))
      @rEl.attr("stroke": @strokeColor, "stroke-width": @normalStrokeWidth)
      @rEl.hover(@onMouseOver, @onMouseOut)
      
      @rText = @mainCanvasView.createText()
      @rText.attr("font-size": 16, fill: @textColor)
      @rTextBackground = @mainCanvasView.createRect()
      @rTextBackground.attr(
        "stroke": "#000000"
        "stroke-width": 0.5
        "fill": "#FFFFFF"
        "fill-opacity": 0.9
      )
      @updateRLabels()
      
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
      if @model.isRight()
        @_leftRange = @model.collection.getLeftRange()
      if @model.isLeft()
        @_rightRange = @model.collection.getRightRange()
      @
    onDragMove: (dx, dy, x, y, evt) =>
      slack = 5
      locationX = @mainCanvasView.getCurrentPositionFromEvt(evt).x
      if @_leftRange? and @_leftRange.get('x') + slack > locationX
        return
      if @_rightRange? and locationX > @_rightRange.get('x') - slack
        return
      @model.set(x: locationX)
      @
    onDragEnd: (evt) =>
      delete @_leftRange
      delete @_rightRange
      @

    toFront: () =>
      @rEl.toFront()
      @rTextBackground.toFront()
      @rText.toFront()
      @
    toBack: () =>
      @rText.toBack()
      @rTextBackground.toBack()
      @rEl.toBack()
      @
    updateRElPositionX: (m, value) =>
      @rEl.attr("path")[0][1] = value
      # use V
      #@rEl.attr("path")[1][1] = value
      @rEl.attr(path: @rEl.attr("path").toString())
      @
    updateRLabels: () =>
      v = @model.get("value")
      if v?
        @rText.show()
        @rTextBackground.show()

        cx = @model.get("x")
        @rText.attr(x: cx, y: 10, text: v)
        w = @rText.getBBox().width
        slackX = 5
        @rTextBackground.attr(x: cx - (w/2) - slackX, y: 0, width: w + (2*slackX), height: 20)
      else
        @rText.hide()
        @rTextBackground.hide()
      @

    start: () =>
      @rEl.drag(@onDragMove, @onDragStart, @onDragEnd)
      @toFront()
      @
    stop: () =>
      @rEl.undrag()
      @

