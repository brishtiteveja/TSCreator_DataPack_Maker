define [], () ->
  class Timeline extends Backbone.View
    tagName: "div"
    className: "data-list"

    showTemplate: new EJS(url: "templates/timelines/show")
    editTemplate: new EJS(url: "templates/timelines/edit")
    template: () =>
      temp = if @isEditing then @editTemplate else @showTemplate
      temp.render.apply(temp, arguments)
    isEditing: false

    events:
      "click .edit-btn": "editAction"
      "click .timeline-detail": "editAction"
      "click .delete-btn": "deleteAction"
      "click .cancel-btn": "cancelAction"
      "change input[type='text']": "update"
    initialize: (options) ->
      @mainCanvasView = options.mainCanvasView
      @rLine = @mainCanvasView.createInfiniteHorizontalPathWithY(@model.get("y"))
      @rLine.node.setAttribute("class", "timeline")

      @listenTo(@model, "toFront", @toFront)
      @listenTo(@model, "toBack", @toBack)
      @
    destroy: () =>
      @undelegateEvents()
      @remove()   # includes stopListening()
      @model = null
      @
    update: ($evt) =>
      $input = $($evt.target)
      key = $input.attr("name")
      value = $input.val()
      @model.set(key, value)
      @

    editAction: ($evt) =>
      $evt.stopImmediatePropagation()
      @isEditing = true
      @render()
      @
    deleteAction: ($evt) =>
      $evt.stopImmediatePropagation()
      @model.destroy
        wait: true
      @destroy()
      @
    #saveAction: () =>
    #  @isEditing = false
    #  @render()
    #  @
    cancelAction: ($evt) =>
      $evt.stopImmediatePropagation()
      @isEditing = false
      @render()
      @

    toFront: () =>
      @rLine.toFront()
      @
    toBack: () =>
      @rLine.toBack()
      @
    render: () =>
      @$el.html(@template(@model.toJSON()))
      @


