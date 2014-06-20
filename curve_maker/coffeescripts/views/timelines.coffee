define ["./detail", "../models/timelines", "./timeline"], (Detail, TimelineCollection, TimelineView) ->
  class Timelines extends Detail
    initialize: (options) ->
      super(options)

      # Maintain separate timelines collection
      @timelines = new TimelineCollection()
      @model.set("timelines", @timelines)

      @listenTo(@timelines, "add", @addOne)

      # TODO: debugging
      @listenTo(@timelines,
        "change": @logger
      )

      @
    addOne: (m) =>
      newTimelineView = new TimelineView(
        model: m
        mainCanvasView: @mainCanvasView
     ).render()
      m.view = newTimelineView
      @$el.append(newTimelineView.el)
      @
    logger: (m, value) ->
      console.log value
      @
    render: () =>
      _.each(@timelines, @addOne)
      @
