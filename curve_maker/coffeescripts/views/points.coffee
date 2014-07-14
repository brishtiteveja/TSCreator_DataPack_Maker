define ["./point"], (PointView) ->
  class Points extends Backbone.View
    tagName: "div"
    className: "point-list"
    template: new EJS(url: "templates/points/sublist_header")
    isExpanded: false
    initialize: (options) ->
      @lines = options.lines
      @columnManager = options.columnManager
      @mainCanvasView = options.mainCanvasView
      @start()

      @listenTo(@, "destroy", @destroy)
      @listenTo(@collection,
        "add": @addOne
        "remove": @removeOne
        "destroyAll": @destroyAll
      )
      @listenTo(@mainCanvasView,
        "start:addingCurve": @start
        "stop:addingCurve": @stop
      )

      @_setupHeader()
      @
    _setupHeader: () ->
      @$header = $(@template.render())
      @$header.click(@toggleWrapper)
      @
    _cleanupHeader: () ->
      @$header.unbind("click")
      @
    addOne: (m, c, options) =>
      newChildView = new PointView(
        model: m
        mainCanvasView: @mainCanvasView
      ).render()
      i = @collection.indexOf(m)
      if i is 0
        @$header.after(newChildView.el)
      else
        @collection.at(i-1).trigger("_insertAfterMe", newChildView)
      # Update wrapper...
      @updateWrapper()
      # Update Lines and Fills
      @lines.trigger("addingLine", @collection.at(i-1), @collection.at(i), @collection.at(i+1))

      @
    removeOne: (m, c, options) =>
      # Update Lines and Fills 
      prevI = options.index
      @lines.trigger("removingLine", @collection.at(prevI-1), m, @collection.at(prevI))

      @
    destroyAll: () =>
      while @collection.at(0)?
        @collection.at(0).destroy()
      @
    destroy: () =>
      @stop()
      @undelegateEvents()
      @_cleanupHeader()
      @remove()
      @
    detachEl: () =>
      @$el.detach()
      @
    toggleWrapper: () =>
      @isExpanded = !@isExpanded
      @updateWrapper()
      @
    updateWrapper: (evt) =>
      if @isExpanded
        @$el.children().not(@$header).show()
      else
        @$el.children().not(@$header).hide()
      @
    render: () =>
      @$el.html(@$header)
      @collection.each(@addOne)
      @updateWrapper()
      @

    start: () =>
      @
    stop: () =>
      @
    
