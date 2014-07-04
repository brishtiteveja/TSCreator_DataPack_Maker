define [
  "./models/columns"
  "./views/timelines"
  "./models/timelines"
  "./views/zones"
  "./models/zones"
  "./views/ranges"
  "./models/ranges"
  "./views/curves"
  "./models/curves"
  "./models/points"
  "./views/image_detail"
  "./models/background_image"
], (ColumnCollection, TimelinesView, TimelineCollection, ZonesView, ZoneCollection, RangesView, RangeCollection, CurvesView, CurveCollection, PointCollection, ImageDetailView, BackgroundImageModel) ->
  class ColumnManager extends Backbone.Model
    currentColumnIdx: 0
    initialize: (options) ->
      # For now, this only has exactly one curve-type column 
      @columns = new ColumnCollection([
        {
          type: "curve"
        }
      ])
      @initCurrentDataModules()

      @
    #isCurrentColumnInitialized: () =>
    #  currentColumn = @columns.at(@currentColumnIdx)
    #  currentColumn.get("isInitialized")
    
    initCurrentDataModules: () =>
      currentColumn = @columns.at(@currentColumnIdx)
      currentConfig = @configs[currentColumn.get("type")]
      updates = {}
      _.each(currentConfig.requires, (r) =>
        module = @modules[r]
        updates[r] = new module.dataClazz if module.dataClazz?
      )
      currentColumn.set(updates)
      @
    getCurrentModulesForDetails: () =>
      currentColumn = @columns.at(@currentColumnIdx)
      currentConfig = @configs[currentColumn.get("type")]
      _.map(currentConfig.requires, (r) =>
        @modules[r]
      )
    retrieveCurrentDataModule: (name) =>
      currentColumn = @columns.at(@currentColumnIdx)
      currentColumn.get(name)




    configs:
      curve:
        requires: ["timelines", "zones", "ranges", "curves", "backgroundImage", "referenceColumns", "defaults", "chartSettings"]

    modules:
      timelines:
        text: "Time Lines"
        title: "Show time line details"
        viewClazz: TimelinesView
        dataClazz: TimelineCollection
      zones:
        text: "Zones"
        title: "Show zone details"
        viewClazz: ZonesView
        dataClazz: ZoneCollection
      ranges:
        text: "Range"
        title: "Show range limit details"
        template: new EJS(url: "templates/ranges/show")
        viewClazz: RangesView
        dataClazz: RangeCollection
      curves:
        text: "Curves"
        title: "Show curve details"
        viewClazz: CurvesView
        dataClazz: CurveCollection
      backgroundImage:
        text: "Image"
        title: "Set up background image"
        template: new EJS(url: "templates/image/show")
        viewClazz: ImageDetailView
        dataClazz: BackgroundImageModel
      referenceColumns:
        text: "References"
        title: "Set reference columns"
      defaults:
        text: "Defaults"
        title: "Defaults..."
      chartSettings:
        text: "Chart Setting"
        title: "Set chart settings"
    
