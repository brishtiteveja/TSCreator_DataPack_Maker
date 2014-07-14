define [
  "./views/notifications"
  "./views/main_canvas"
  "./views/tools"
  "./views/detail_buttons"
  "./views/details"
], (NotificationsView, MainCanvasView, ToolsView, DetailButtonsView, DetailsView, TimelineCollection, ZoneCollection) ->
  class CurveMaker extends Backbone.View
    initialize: (options) ->
      @columnManager = options.columnManager
      
      # TODO: debugging
      #window.maker = @
      
      # Notifications
      @notificationsView = new NotificationsView(
        className: "notifications"
      ).render()
      @proxyListenTo(@, "showInfo", @notificationsView)

      # Main Canvas
      # Note: Main Canvas will work as a proxy(or factory) for Raphael paper
      # (createRect, createImage, ...)
      @mainCanvasView = new MainCanvasView(
        className: "col1 disable-user-select"
        masterView: @
      ).render()

      # Toolbar
      @toolsView = new ToolsView(
        className: "col2 toolbar"
      ).render()
      @setUpProxyEventsFromTools()
      
      # TODO: debugging
      @listenTo(@toolsView, "all", (event) ->
        if event isnt "selectTool" and event isnt "change" and event isnt "change:isActivated"
          console.log event
      )

      # Details
      @detailsView = new DetailsView(
        className: "detail-panels"
        mainCanvasView: @mainCanvasView
        columnManager: @columnManager
      ).render()
      @detailButtonsView = new DetailButtonsView(
        className: "detail-buttons"
        collection: @detailsView.collection   # share detail collection with @detailsView
      ).render()
      
      # window resize
      debouncedResize = _.debounce(@resize, 150)
      $(window).resize(debouncedResize)
      @disableDefaultFileDrop()

      @
    resize: () =>
      heightOnlyDimension =
        height: $(window).height()
      @toolsView.resize(heightOnlyDimension)
      @detailButtonsView.resize(heightOnlyDimension)
      @detailsView.resize(heightOnlyDimension)
      
      mainCanvasDimension =
        height: heightOnlyDimension.height
        width: $(document).width() - @toolsView.$el.outerWidth() - @detailButtonsView.$el.outerWidth()
      @mainCanvasView.resize(mainCanvasDimension)
      @
    disableDefaultFileDrop: () =>
      $(window).on("dragover", ($evt) -> $evt.preventDefault())
      $(window).on("dragenter", ($evt) -> $evt.preventDefault())
      $(window).on("drop", ($evt) -> $evt.preventDefault())
      @
    render: () =>
      @$el.append(@notificationsView.el)
      @$colwrappers = $("<div class='colmask'><div class='colmid'><div class='colleft'></div></div></div>").appendTo(@$el)
      $colleft = @$colwrappers.find(".colleft")
      $colleft.append("<div class='col1wrap'></div>")
      $col1wrap = $colleft.find(".col1wrap")
      @$details = $("<div/>", class: "col3 details")
                    .append(@detailButtonsView.el)
                    .append(@detailsView.el)

      $col1wrap.append(@mainCanvasView.el)
      $colleft.append(@toolsView.el)
              .append(@$details)

      @resize()
      @


    setUpProxyEventsFromTools: () ->
      @proxyListenTo(@toolsView, "zoomIn", @mainCanvasView)
      @proxyListenTo(@toolsView, "zoomOut", @mainCanvasView)
      @proxyListenTo(@toolsView, "start:panning", @mainCanvasView)
      @proxyListenTo(@toolsView, "stop:panning", @mainCanvasView)
      @proxyListenTo(@toolsView, "start:addingTimeline", @mainCanvasView)
      @proxyListenTo(@toolsView, "stop:addingTimeline", @mainCanvasView)
      @proxyListenTo(@toolsView, "start:addingRange", @mainCanvasView)
      @proxyListenTo(@toolsView, "stop:addingRange", @mainCanvasView)
      @proxyListenTo(@toolsView, "start:addingCurve", @mainCanvasView)
      @proxyListenTo(@toolsView, "stop:addingCurve", @mainCanvasView)
      @
    # nice little helper to create proxy events
    proxyListenTo: (fromObj, event, toObj) =>
      @listenTo(fromObj, event, () ->
        Array.prototype.unshift.call(arguments, event)
        toObj.trigger.apply(toObj, arguments)
      )
      @
