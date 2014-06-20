define ["./detail", "../models/timelines", "./timeline"], (Detail, TimelineCollection, TimelineView) ->
  class Timelines extends Detail
    initialize: (options) ->
      super(options)

      # Maintain separate timelines collection
      @timelines = new TimelineCollection()
      @model.set("timelines", @timelines)

      @listenTo(@timelines, "add", @addOne)

      @overlay = @mainCanvasView.createInfiniteOverlay()
      @listenTo(@mainCanvasView, "start:addingTimeline", @start)
      @listenTo(@mainCanvasView, "stop:addingTimeline", @stop)

      # TODO: debugging
      #@listenTo(@timelines,
      #  "change": @logger
      #)

      @
    addOne: (m) =>
      newTimelineView = new TimelineView(
        model: m
        mainCanvasView: @mainCanvasView
     ).render()
      m.view = newTimelineView
      @$el.append(newTimelineView.el)
      @

    start: () =>
      @overlay.toFront()
      _.each(@timelines, @timelineToFront)
      @overlay.dblclick(@addingNewTimeline)
      console.log @overlay
      @
    stop: () =>
      _.each(@timelines, @timelineToBack)
      @overlay.toBack()
      @overlay.undblclick(@addingNewTimeline)
      console.log @overlay
      @
    addingNewTimeline: (evt, clientX, clientY) =>
      position = @mainCanvasView.getCurrentPositionFromOffset(evt.offsetX, evt.offsetY)
      @timelines.addOneWithY(position.y)
      @

    timelineToFront: (timeline) =>
      timeline.trigger("toFront")
      @
    timelineToBack: (timeline) =>
      timeline.trigger("toBack")
      @
    render: () =>
      _.each(@timelines, @addOne)
      @


    # TODO: debugging
    logger: (m, options) ->
      console.log m
      @
    
