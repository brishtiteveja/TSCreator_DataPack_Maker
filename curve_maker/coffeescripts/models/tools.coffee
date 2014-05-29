define ["./tool"], (Tool) ->
  class Tools extends Backbone.Collection
    model: Tool
    activatedToolModel: null
    initialize: () ->
      @on("toggleTool", @toggleTool)
      @
    toggleTool: (m) =>
      #@findWhere(name: m.get("name"))
      if @activatedToolModel? and @activatedToolModel is m
        m.deactivate()
        @activatedToolModel = null
      else
        @activatedToolModel.deactivate() if @activatedToolModel?
        m.activate()
        @activatedToolModel = m
      @
