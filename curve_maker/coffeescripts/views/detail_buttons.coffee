define ["../models/detail", "../models/details", "./detail_button"], (DetailModel, DetailCollection, DetailButtonView) ->
  class DetailButtons extends Backbone.View
    tagName: "div"
