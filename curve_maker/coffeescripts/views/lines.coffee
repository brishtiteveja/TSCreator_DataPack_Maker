define ["./line"], (LineView) ->
  class Lines extends Backbone.View
    tagName: "div"
    className: "line-list"
    template: new EJS(url: "templates/lines/sublist_header")
    isExpanded: false
    initialize: (options) ->
      @points = options.points
      @columnManager = options.columnManager
      @mainCanvasView = options.mainCanvasView
      @start()

      @listenTo(@, "destroy", @destroy)
      @listenTo(@collection,
        "add": @addOne
        "remove": @removeOne
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
    addOne: (m) =>
      newChildView = new LineView(
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
      # Update something...
      
      @
    removeOne: (m, c, options) =>
      # Update something

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


