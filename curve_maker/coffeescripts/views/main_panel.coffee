define [], () ->
  class MainPanel extends Backbone.View
    tagName: "main"
    introTemplate: new EJS(url: "templates/intro.ejs")
    events:
      "dragOver .image-dropbox": "dragCleanup"
      "dragEnter .image-dropbox": "dragCleanup"
      "drop .image-dropbox": "startAndReplaceImage"
    initialize: (options) ->
      @
    dragCleanup: ($evt) ->
      $evt.preventDefault()
      $evt.stopPropagation()
      console.log $evt
      @
    startAndReplaceImage: ($evt) =>
      $evt.preventDefault()
      $evt.stopPropagation()
      oEvent = $evt.originalEvent
      oEvent.preventDefault()
      oEvent.stopPropagation()

      console.log $evt
      @
    render: () =>
      @$el.html(@introTemplate.render())
      @
