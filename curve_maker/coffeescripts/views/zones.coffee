define ["./detail", "./zone"], (Detail, ZoneView) ->
  class Zones extends Detail
    className: "detail-panel expandable-edit"
    initialize: (options) ->
      super(options)

      # Maintain separate zones collection
      @zones = @columnManager.retrieveCurrentDataModule("zones")

      @listenTo(@zones, "add", @addOne)
      
      @
    addOne: (m) =>
      newChildView = new ZoneView(
        model: m
        mainCanvasView: @mainCanvasView
      ).render()
      i = @zones.indexOf(m)
      if i is 0
        @$el.prepend(newChildView.el)
      else
        @zones.at(i-1).trigger("_insertAfterMe", newChildView)
      @


    render: () =>
      _.each(@zones, @addOne)
      @

