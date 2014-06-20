define ["./detail"], (Detail) ->
  class BackgroundImageDetail extends Detail
    events:
      "drop .image-dropbox": "loadBackgroundImage"
      "change input[name=curWidth]": "onCurWidthChange"
      "change input[name=curHeight]": "onCurHeightChange"
      "change input[name=rotation]": "onRotationChange"
      "click input[name=isVisible]": "onIsVisibleChange"
      "click input[name=isPreserveAspectRatio]": "onIsPreserveAspectRatioChange"
    initialize: (options) ->
      super(options)

      # Maintain separate image model
      @image = new Backbone.Model()
      @model.set("image", @image)

      @listenTo(@image,
        "change:dataURL": @changeBackgroundImage
        "change:curWidth change:curHeight": @changeBackgroundImageAttributes
        "change:rotation change:isVisible": @changeBackgroundImageAttributes
        "change:curWidth": @updateCurWidthInput
        "change:curHeight": @updateCurHeightInput
        "change:rotation": @updateRotationInput
        "change:isVisible": @updateIsVisibleInput
        "change:isPreserveAspectRatio": @updateIsPreserveAspectRatioInput
      )

      # Set isPreserveAspectRatio to TRUE by default
      @image.set
        isVisible: true
        isPreserveAspectRatio: true
      @
    loadBackgroundImage: ($evt) =>
      $evt.preventDefault()
      $evt.stopPropagation()
      
      if $evt.originalEvent.dataTransfer.files.length is 1
        imageFile = $evt.originalEvent.dataTransfer.files[0]
        reader = new FileReader()
        reader.onload = @readBackgroundImage
        reader.readAsDataURL(imageFile)
      @
    readBackgroundImage: (evt) =>
      imageData = evt.target.result
      @_asyncGetImageDimension((dimension) =>
        @image.set(
          dataURL: imageData
          origWidth: dimension.width
          origHeight: dimension.height
          curWidth: dimension.width
          curHeight: dimension.height
        )
      , imageData)
      @
    _asyncGetImageDimension: (callback, imageData) ->
      # a solution from transect maker..
      img = new Image()
      $(img).load(($loadEvt) ->
        callback(width: img.width, height: img.height)
      )
      img.src = imageData
      @
    
    # Model -> Canvas
    changeBackgroundImage: (m, imageData, options) =>
      if @rBackgroundImage?
        @rBackgroundImage.remove()
      @rBackgroundImage = @mainCanvasView.createImage(imageData)
      @rBackgroundImage.toBack()
      @
    changeBackgroundImageAttributes: (m, value, options) =>
      if @rBackgroundImage?
        @rBackgroundImage.attr
          width: m.get("curWidth")
          height: m.get("curHeight")
          transform: "r#{m.get("rotation")}"
          x: 0
          y: 0
        if m.get("isVisible")
          @rBackgroundImage.show()
        else
          @rBackgroundImage.hide()
      @
    
    # Model -> HTML
    updateCurWidthInput: (m, value) =>
      $input = @$el.find("input[name=curWidth]")
      if $input.val() isnt value
        $input.val(value)
      @
    updateCurHeightInput: (m, value) =>
      $input = @$el.find("input[name=curHeight]")
      if $input.val() isnt value
        $input.val(value)
      @
    updateRotationInput: (m, value) =>
      $input = @$el.find("input[name=rotation]")
      if $input.val() isnt value
        $input.val(value)
      @
    updateIsVisibleInput: (m, value) =>
      $input = @$el.find("input[name=isVisible]")
      if $input.prop("checked") isnt @image.get("isVisible")
        $input.prop("checked", @image.get("isVisible"))
      @
    updateIsPreserveAspectRatioInput: (m, value) =>
      $input = @$el.find("input[name=isPreserveAspectRatio]")
      if $input.prop("checked") isnt @image.get("isPreserveAspectRatio")
        $input.prop("checked", @image.get("isPreserveAspectRatio"))
      @

    # HTML -> MODEL
    onCurWidthChange: ($evt) =>
      value = parseInt($($evt.target).val())
      if @image.get("isPreserveAspectRatio")
        @image.set
          curWidth: value
          curHeight: parseInt(value / @image.get("origWidth") * @image.get("origHeight"))
      else
        @image.set
          curWidth: value
      @
    onCurHeightChange: ($evt) =>
      value = parseInt($($evt.target).val())
      if @image.get("isPreserveAspectRatio")
        @image.set
          curWidth: parseInt(value / @image.get("origHeight") * @image.get("origWidth"))
          curHeight: value
      else
        @image.set
          curHeight: value
      @
    onRotationChange: ($evt) =>
      value = parseFloat($($evt.target).val())
      @image.set
        rotation: value
      @
    onIsVisibleChange: ($evt) =>
      value = $($evt.target).prop("checked")
      @image.set
        isVisible: value
      @
    onIsPreserveAspectRatioChange: ($evt) =>
      value = $($evt.target).prop("checked")
      @image.set
        isPreserveAspectRatio: value
      @
