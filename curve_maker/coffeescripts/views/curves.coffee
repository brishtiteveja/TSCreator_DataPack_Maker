define ["./detail", "./curve", "./points"], (Detail, CurveView, PointsView) ->
  class Curves extends Detail
    className: "detail-panel"
    initialize: (options) ->
      super(options)

      @curves = @columnManager.retrieveCurrentDataModule("curves")

      @listenTo(@curves,
        "add": @addOne
        "remove": @removeOne
        "selectThis": @selectThis
      )

      @overlay = @mainCanvasView.createInfiniteOverlay()
      @listenTo(@mainCanvasView,
        "start:addingCurve": @start
        "stop:addingCurve": @stop
      )
      @
    addOne: (m, c, options) =>
      newChildView = new CurveView(
        model: m
        columnManager: @columnManager
        mainCanvasView: @mainCanvasView
      ).render()
      i = @curves.indexOf(m)
      if i is 0
        @$el.prepend(newChildView.el)
      else
        @curves.at(i-1).trigger("_insertAfterMe", newChildView)
      # Update something here...

      @
    removeOne: (m, c, options) =>
      # Update something here...
      @deselectCurrentIfExists() if m is @currentCurve
      @
    render: () =>
      _.each(@curves, @addOne)
      @


    selectThis: (m) =>
      isSelectingNew = (@currentCurve isnt m)
      @deselectCurrentIfExists()
      if isSelectingNew
        m.trigger("selected")
        @currentCurve = m
      @
    deselectCurrentIfExists: () =>
      if @currentCurve?
        @currentCurve.trigger("unselected")
        delete @currentCurve
      @
    addingChild: (evt, clientX, clientY) =>
      position = @mainCanvasView.getCurrentPositionFromEvt(evt)
      if @currentCurve?
        @currentCurve.get("points").add(
          x: position.x
          y: position.y
        )
        @currentCurve.trigger("selected")
      else
        newCurve = @curves.addWithFirstPoint(
          x: position.x
          y: position.y
        )
        @selectThis(newCurve)
      @
    
    start: () =>
      @overlay.toFront()
      @overlay.dblclick(@addingChild)
      @curves.each((m) -> m.trigger("toFront"))
      @
    stop: () =>
      @overlay.toBack()
      @overlay.undblclick(@addingChild)
      @deselectCurrentIfExists()
      @

