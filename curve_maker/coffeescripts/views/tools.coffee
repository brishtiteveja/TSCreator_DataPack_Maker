define ["../models/tool","../models/tools", "./tool"], (ToolModel, ToolCollection, ToolView) ->
  class Tools extends Backbone.View
    tagName: "div"
    events:
      "mouseleave": "forceToRedraw"
    initialize: (options) ->
      @collection = new ToolCollection()
      @listenTo(@collection, "add", @addOne)
      @listenTo(@collection, "selectTool", @selectTool)
      @listenTo(@, "deactivateAll", @deactivateAllTogglableTools)
      @
    addOne: (m) =>
      newToolView = new ToolView(model: m).render()
      m.view = newToolView
      @$el.append(newToolView.el)
      #@$noScrollbarWrapper.append(newToolView.el)
      @
    forceToRedraw: ($evt) =>
      # CSS Hack for Chrome to redraw after hiding scrollbar...
      @$el.hide().show(0)
      @
    resize: (dimension) =>
      @$el.css(dimension)
      @
    render: () =>
      #@$noScrollbarWrapper = $("<div/>", class: "no-scrollbar-wrapper").appendTo(@$el)
      @collection.add
        name: "pointer"
        action: { type: "toggle", groupId: 1, startEvent: "noop", stopEvent: "noop" }
        title: "mouse pointer"
      @collection.add
        name: "lock-cursor-h"
        action: { type: "toggle", groupId: 2, startEvent: "noop", stopEvent: "noop" }
        title: "lock cursor in X."
      @collection.add
        name: "lock-cursor-v"
        action: { type: "toggle", groupId: 2, startEvent: "noop", stopEvent: "noop" }
        title: "lock cursor in V."
      @collection.add
        name: "zoom-in"
        action: { type: "click", event: "zoomIn" }
        title: "zoom in"
      @collection.add
        name: "zoom-out"
        action: { type: "click", event: "zoomOut" }
        title: "zoom out"
      @collection.add
        name: "pan"
        action: { type: "toggle", groupId: 1, startEvent: "start:panning", stopEvent: "stop:panning" }
        title: "move"
      @collection.add
        name: "add-timeline"
        action: { type: "toggle", groupId: 1, startEvent: "start:addingTimeline", stopEvent: "stop:addingTimeline" }
        title: "create a new timeline"
      @collection.add
        name: "add-range-lines"
        action: { type: "toggle", groupId: 1, startEvent: "start:addingRange", stopEvent: "stop:addingRange" }
        title: "Set up range reference lines"
      @collection.add
        name: "add-new-curve"
        action: { type: "toggle", groupId: 1, startEvent: "start:addingCurve", stopEvent: "stop:addingCurve" }
        title: "Add a new curve"
      @collection.add
        name: "show-ref-panel"
        action: { type: "toggle", groupId: 3, startEvent: "showRefTimelines", stopEvent: "hideRefTimelines" }
        title: "show reference panel"
      @collection.add
        name: "save-to-local-storage"
        action: { type: "click", event: "localSave" }
        title: "save to local storage"
      @collection.add
        name: "reload-data"
        action: { type: "click", event: "quickReload" }
        title: "reload data from local storage"
      @collection.add
        name: "export-data"
        action: { type: "toggle", groupId: 1, startEvent: "showExportPreview", stopEvent: "hideExportPreview" }
        title: "export data"
      @collection.add
        name: "file-system"
        action: { type: "toggle", groupId: 1, startEvent: "showSandbox", stopEvent: "hideSandbox" }
        title: "sandbox"
      @
    

    # Deal with activation/deactivation of tools
    selectTool: (m) =>
      action = m.get("action")
      if action.type is "click"
        @trigger(action.event)
      else if action.type is "toggle"
        # first deactivate other activated tools in the same group
        @collection.chain().select((tool) ->
          a = tool.get("action")
          tool.isActivated() and tool isnt m and
          a.type is action.type and a.groupId is action.groupId
        ).each(@deactivateTogglableTool)

        if m.isActivated()
          @deactivateTogglableTool(m)
        else
          @activateTogglableTool(m)
      @
    deactivateAllTogglableTools: () =>
      @collection.chain().select((tool) ->
        a = tool.get("action")
        tool.isActivated() and a.type is "toggle"
      ).each(@deactivateTogglableTool)
      @
    # Helper functions for manipulating toggle type tools
    activateTogglableTool: (m) =>
      a = m.get("action")
      if a.type is "toggle"
        m.activate()
        @trigger(a.startEvent)
      @
    deactivateTogglableTool: (m) =>
      a = m.get("action")
      if a.type is "toggle"
        m.deactivate()
        @trigger(a.stopEvent)
      @
