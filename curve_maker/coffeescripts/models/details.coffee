define ["./detail"], (Detail) ->
  class Details extends Backbone.Collection
    model: Detail
    activatedDetailModel: null
    initialize: () ->
      @listenTo(@, "toggleDetail", @toggleDetail)
      @
    toggleDetail: (m) =>
      if @activatedDetailModel? and @activatedDetailModel is m
        m.deactivate()
        @activatedDetailModel = null
      else
        @activatedDetailModel.deactivate() if @activatedDetailModel?
        m.activate()
        @activatedDetailModel = m
      @
