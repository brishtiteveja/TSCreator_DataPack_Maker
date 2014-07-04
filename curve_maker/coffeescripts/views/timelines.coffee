define ["./detail", "./timeline"], (Detail, TimelineView) ->
  class Timelines extends Detail
    className: "detail-panel inline-edit"
    initialize: (options) ->
      super(options)

      @timelines = @columnManager.retrieveCurrentDataModule("timelines")

      @listenTo(@timelines, "add", @addOne)
      @listenTo(@timelines, "remove", @removeOne)

      @overlay = @mainCanvasView.createInfiniteOverlay()
      @listenTo(@mainCanvasView,
        "start:addingTimeline": @start
        "stop:addingTimeline": @stop
      )
      @
    addOne: (m, c, options) =>
      newChildView = new TimelineView(
        model: m
        mainCanvasView: @mainCanvasView
      ).render()
      i = @timelines.indexOf(m)
      if i is 0
        @$el.prepend(newChildView.el)
      else
        @timelines.at(i-1).trigger("_insertAfterMe", newChildView)
      # Update zones
      @zones.trigger("addingZone", @timelines.at(i-1), @timelines.at(i), @timelines.at(i+1))
      @
    removeOne: (m, c, options) =>
      prevI = options.index
      # Update zones
      @zones.trigger("removingZone", @timelines.at(prevI-1), m, @timelines.at(prevI))
      @

    start: () =>
      @overlay.toFront()
      @overlay.dblclick(@addingChild)
      @
    stop: () =>
      @overlay.toBack()
      @overlay.undblclick(@addingChild)
      @
    addingChild: (evt, clientX, clientY) =>
      position = @mainCanvasView.getCurrentPositionFromEvt(evt)
      #@timelines.addWithRounding(y: position.y)
      @timelines.add(y: position.y)
      @

    render: () =>
      _.each(@timelines, @addOne)
      @

