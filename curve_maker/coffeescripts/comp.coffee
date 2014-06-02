define [
  "./views/main_panel"
  "./views/tools"
  "./models/details"
  "./views/detail_buttons"
  "./views/details"
], (MainPanelView, ToolsView, DetailCollection, DetailButtonsView, DetailsView) ->
  class CurveMaker extends Backbone.View
    initialize: (options) ->
      # Main Panel
      @mainPanelView = new MainPanelView(className: "col1 disable-user-select").render()
      # Toolbar
      @toolsView = new ToolsView(className: "col2 toolbar").render()
      # Details
      @detailList = new DetailCollection()
      @detailButtonsView = new DetailButtonsView(
        className: "detail-buttons"
        detailList: @detailList
      ).render()
      @detailsView = new DetailsView(
        className: "detail-panels"
        detailList: @detailList
      ).render()
      
      $(window).resize(@resizer)

      @
    resizer: () =>
      @_resizerHelper(height: $(window).height())
      @
    _resizerHelper: _.debounce((dimension) ->
        @mainPanelView.$el.css(dimension)
        @toolsView.$el.css(dimension)
        @$details.css(dimension)
      , 300)
    render: () =>
      @$colwrappers = $("<div class='colmask'><div class='colmid'><div class='colleft'></div></div></div>").appendTo(@$el)
      $colleft = @$colwrappers.find(".colleft")
      $colleft.append("<div class='col1wrap'></div>")
      $col1wrap = $colleft.find(".col1wrap")

      @$details = $("<div/>", class: "col3 details")
                    .append(@detailButtonsView.el)
                    .append(@detailsView.el)

      #@$el.append(@toolsView.el)
      #    .append(@$mainPanel)
      #    .append(@$details)
      $col1wrap.append(@mainPanelView.el)
      $colleft.append(@toolsView.el)
              .append(@$details)

      @resizer()

      @

