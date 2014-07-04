define [], () ->
  class Zone extends Backbone.View
    tagName: "div"
    className: "data-list"

    showTemplate: new EJS(url: "templates/zones/show")
    editTemplate: new EJS(url: "templates/zones/edit")
    template: () =>
      temp = if @isEditing then @editTemplate else @showTemplate
      temp.render.apply(temp, arguments)
    isEditing: false

    events:
      "click .edit-btn": "editAction"
      "click .zone-detail.showing": "editAction"
      "click .cancel-btn": "cancelAction"
      "change input[type=text]": "inputUpdate"
      "change textarea": "inputUpdate"
      "mouseover": "onMouseOver"
      "mouseout": "onMouseOut"
    initialize: (options) ->
      @mainCanvasView = options.mainCanvasView

      @listenTo(@model,
        "_insertAfterMe": @_insertAfterMe
        "destroy": @destroy
      )
      @
    destroy: () =>
      @undelegateEvents()
      @remove()   # calss stopListening()
      @
    inputUpdate: ($evt) =>
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
      #  wait: true
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
    _insertAfterMe: (newView) =>
      @$el.after(newView.el)
      @
    render: () =>
      @$el.html(@template(@model.toJSON()))
      @


    onMouseOver: () =>
      @$el.addClass('hover')
      @model.get("top").trigger("highlight")
      @model.get("base").trigger("highlight")
      @
    onMouseOut: () =>
      @$el.removeClass('hover')
      @model.get("top").trigger("unhighlight")
      @model.get("base").trigger("unhighlight")
      @

