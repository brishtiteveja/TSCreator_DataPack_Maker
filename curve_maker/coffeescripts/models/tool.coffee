define [], () ->
  class Tool extends Backbone.Model
    defaults:
      isActivated: false
    isActivated: () =>
      @get("isActivated")
    activate: () =>
      @set(isActivated: true)
    deactivate: () =>
      @set(isActivated: false)
    toggle: () =>
      @set(isActivated: !@get("isActivated"))
      @get("isActivated")

