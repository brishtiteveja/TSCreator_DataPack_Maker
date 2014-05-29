define [
  "./views/tools"
  "./models/details"
  "./views/detail_buttons"
  "./views/details"
], (ToolsView, DetailCollection, DetailButtonsView, DetailsView) ->
  class CurveMaker extends Backbone.View
    initialize: (options) ->
      @toolsView = new ToolsView(className: "toolbar").render()
        
      @$mainPanel = $("<main/>",
        className: "display"
      )

      @detailList = new DetailCollection()
      @detailButtonsView = new DetailButtonsView(
        className: "detail-buttons"
        detailList: @detailList
      ).render()
      @detailsView = new DetailsView(
        className: "detail-panels"
        detailList: @detailList
      ).render()

      @
    render: () =>
      @$details = $("<div/>", class: "details")
                    .append(@detailButtonsView.el)
                    .append(@detailsView.el)
      @$el.append(@toolsView.el)
          .append(@$mainPanel)
          .append(@$details)

      @

