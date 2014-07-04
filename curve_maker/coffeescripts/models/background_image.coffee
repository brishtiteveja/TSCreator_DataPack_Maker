define [], () ->
  class BackgroundImage extends Backbone.Model
    defaults:
      isVisible: true
      isPreserveAspectRatio: true

