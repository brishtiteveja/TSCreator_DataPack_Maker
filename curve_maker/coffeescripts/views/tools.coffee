define ["../models/tool","../models/tools", "./tool"], (ToolModel, ToolCollection, ToolView) ->
  class Tools extends Backbone.View
    tagName: "div"
    initialize: (options) ->
      @toolList = new ToolCollection()
      @toolList.on("add", @addOne)
      @
    addOne: (m) =>
      newToolView = new ToolView(model: m).render()
      m.view = newToolView
      @$el.append(newToolView.el)
      @
    activateTool: () =>
      @
    render: () =>
      @toolList.add {name: "tool-pointer", title: "mouse pointer"}
      @toolList.add {name: "tool-lock-cursor-h", title: "lock cursor in X."}
      @toolList.add {name: "tool-lock-cursor-v", title: "lock cursor in V."}
      @toolList.add {name: "tool-zoom-in", title: "zoom in"}
      @toolList.add {name: "tool-zoom-out", title: "zoom out"}
      @toolList.add {name: "tool-pan", title: "move"}
      @toolList.add {name: "tool-add-marker", title: "create a new timeline"}
      @toolList.add {name: "tool-add-range-lines", title: "Set up range reference lines"}
      @toolList.add {name: "tool-show-ref-panel", title: "show reference panel"}
      @toolList.add {name: "tool-save-to-local-storage", title: "save to local storage"}
      @toolList.add {name: "tool-reload-data", title: "reload data from local storage"}
      @toolList.add {name: "tool-export-data", title: "export data"}
      @toolList.add {name: "tool-file-system", title: "sandbox"}
      @
    
    
    
