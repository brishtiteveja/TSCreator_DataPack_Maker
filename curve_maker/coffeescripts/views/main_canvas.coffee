define [], () ->
  INF = 500000
  SMALLINF = 10000
  class MainCanvas extends Backbone.View
    tagName: "main"
    introTemplate: new EJS(url: "templates/intro")
    events:
      "drop .data-dropbox": "startAndLoadDatafile"
      "click .continue": "showPaper"
    initialize: (options) ->
      @masterView = options.masterView
      # Introduction
      @$intro = $(@introTemplate.render())

      @curDimension = null
      @curViewBox = { x: 0, y: 0 }

      # Main canvas
      @rPaper = Raphael(@el, "100%", "100%")
      @initPan()
      @initZoom()

      # TODO: debugging
      #window.x = @rPaper
      #window.y = @panOverlay
      #window.t = @
      @
    showPaper: () =>
      @$intro.hide()
      $(@rPaper.canvas).show()
      @
    loadDatafile: ($evt) =>
      $evt.preventDefault()
      $evt.stopPropagation()
      
      $evt.originalEvent.dataTransfer.files.length isnt 1
      console.log $evt.originalEvent.dataTransfer.files[0]
      @
    startAndLoadDatafile: ($evt) =>
      @showPaper()
      @loadDatafile($evt)
      @
    resize: (dimension) =>
      @curDimension = dimension
      @$el.css(height: @curDimension.height)
      @rPaper.setViewBox(@curViewBox.x, @curViewBox.y,
                         @curDimension.width * @zoomMultiplier, @curDimension.height * @zoomMultiplier)
      @
    render: () =>
      $(@rPaper.canvas).hide()
      @$el.append(@$intro)
      @

    # Proxy functions to create new Raphael elements
    createSet: () =>
      @rPaper.set.apply(@rPaper, arguments)
    createRect: () =>
      @rPaper.rect.apply(@rPaper, arguments)
    createInfiniteOverlay: () =>
      newOverlay = @rPaper.rect(-INF, -INF, 2*INF, 2*INF)
      newOverlay.attr
        "fill": "#FFFFFF"
        "fill-opacity": 0
        "stroke-width": 0
      newOverlay
    createPath: () =>
      @rPaper.path.apply(@rPaper, arguments)
    createStraightLine: () =>
      if arguments.length is 4
        @createPath("M#{arguments[0]},#{arguments[1]}L#{arguments[2]},#{arguments[3]}")
      else if arguments.length is 2
        @createPath("M#{arguments[0].x},#{arguments[0].y}L#{arguments[1].x},#{arguments[1].y}")
    createInfiniteHorizontalPath: (y) =>
      newPath = @createPath("M#{-SMALLINF},#{y}H#{SMALLINF}")  # Chrome has some issues with INF..
      newPath.attr
        "fill": "#FFFFFF"
        "fill-opacity": 0
      newPath
    createInfiniteVerticalPath: (x) =>
      newPath = @rPaper.path("M#{x},#{-SMALLINF}V#{SMALLINF}")  # Chrome has some issues with INF..
      newPath.attr
        "fill": "#FFFFFF"
        "fill-opacity": 0
      newPath
    createCircle: () =>
      @rPaper.circle.apply(@rPaper, arguments)
    createText: () =>
      @rPaper.text.apply(@rPaper, arguments)
    createImage: () =>
      @rPaper.image.apply(@rPaper, arguments)
    getCurrentPositionFromOffset: (dx, dy) =>
      # Returns top left (x, y) position of current ViewBox
      {
        x: @curViewBox.x + (dx * @zoomMultiplier)
        y: @curViewBox.y + (dy * @zoomMultiplier)
      }
    getCurrentPositionFromEvt: (evt) =>
      if evt.offsetX? and evt.offsetY
        dx = evt.offsetX
        dy = evt.offsetY
      else
        dx = evt.layerX
        dy = evt.layerY
      @getCurrentPositionFromOffset(dx, dy)



    # Panning
    initPan: () ->
      # set up psuedo-infinite overlay
      #@panOverlay = @rPaper.rect(@curViewBox.x, @curViewBox.y, "100%", "100%")
      @panOverlay = @createInfiniteOverlay()
      @stopPanning()

      # register panning events
      @listenTo(@, "start:panning", @startPanning)
      @listenTo(@, "stop:panning", @stopPanning)

      @
    onPanningStart: (x, y, evt) =>
      @
    onPanningMove: (dx, dy, x, y, evt) =>
      newX = @curViewBox.x - (dx * @zoomMultiplier)
      newY = @curViewBox.y - (dy * @zoomMultiplier)
      # used to adjust background image here...
      @rPaper.setViewBox(newX, newY,
                         @curDimension.width * @zoomMultiplier, @curDimension.height * @zoomMultiplier)
      @
    onPanningEnd: (evt) =>
      viewBox = @rPaper.canvas.viewBox.baseVal
      @curViewBox =
        x: viewBox.x
        y: viewBox.y
      # No need to adjust pseudo-infinite overlay
      #@panOverlay.attr(@curViewBox)
      @
    startPanning: () =>
      @panOverlay.drag(@onPanningMove, @onPanningStart, @onPanningEnd)
      @panOverlay.toFront()
      @$el.addClass("cursor-panning")
      @
    stopPanning: () =>
      @panOverlay.toBack()
      @panOverlay.undrag()
      @$el.removeClass("cursor-panning")
      @

    # Zooming
    initZoom: () ->
      @defaultZoom = 5
      @zoom = @defaultZoom
      @zoomMultiplier = @defaultZoom / @zoom

      # register zooming events
      @listenTo(@, "zoomIn", @zoomIn)
      @listenTo(@, "zoomOut", @zoomOut)

      @
    zoomIn: () =>
      if @zoom < 20
        @zoom += 1
        @zoomMultiplier = @defaultZoom / @zoom
        @zoomUpdate()
      else
        @masterView.trigger("showInfo", "You cannot zoom-in anymore.", 50)
      @
    zoomOut: () =>
      if @zoom > 1
        @zoom -= 1
        @zoomMultiplier = @defaultZoom / @zoom
        @zoomUpdate()
      else
        @masterView.trigger("showInfo", "You cannot zoom-out anymore.", 50)
      @
    zoomUpdate: () =>
      @rPaper.setViewBox(@curViewBox.x, @curViewBox.y,
                         @curDimension.width * @zoomMultiplier, @curDimension.height * @zoomMultiplier)
      @masterView.trigger("showInfo", "Zoom: #{Math.round((1/@zoomMultiplier)*100)}%", 50)
      @

