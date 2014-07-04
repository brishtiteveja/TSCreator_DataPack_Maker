define ["./detail", "./range"], (Detail, RangeView) ->
  class Ranges extends Detail
    className: "detail-panel"
    initialize: (options) ->
      super(options)

      @ranges = @columnManager.retrieveCurrentDataModule("ranges")

      @listenTo(@ranges, "add", @addOne)
      @listenTo(@ranges, "remove", @removeOne)

      @overlay = @mainCanvasView.createInfiniteOverlay()
      @listenTo(@mainCanvasView,
        "start:addingRange": @start
        "stop:addingRange": @stop
      )
      @
    addOne: (m, c, options) =>
      newRangeView = new RangeView(
        model: m
        template: @template
        mainCanvasView: @mainCanvasView
      ).render()
      @$el.append(newRangeView.el)
      # Update something here...

      @
    removeOne: (m, c, options) =>
      # Update something here...

      @

    start: () =>
      @overlay.toFront()
      @overlay.dblclick(@addingRange)
      @
    stop: () =>
      @overlay.toBack()
      @overlay.undblclick(@addingRange)
      @
    addingRange: (evt, clientX, clientY) =>
      if @ranges.canAddMore()
        position = @mainCanvasView.getCurrentPositionFromEvt(evt)
        @ranges.add
          x: position.x
      else
        console.log "Cannot add more range limits"
      @

    render: () =>
      _.each(@ranges, @addOne)
      @

