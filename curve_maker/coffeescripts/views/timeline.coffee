define [], () ->
  class Timeline extends Backbone.View
    tagName: "div"
    className: "data-list"
    template: new EJS(url: "templates/timeline")
    editTemplate: new EJS(url: "templates/timeline_edit")
    initialize: (options) ->
      @mainCanvasView = options.mainCanvasView
      @
    render: () =>
      @$el.append(@template.render(@model.toJSON()))
      @


