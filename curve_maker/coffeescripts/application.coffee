require.config
  baseUrl: "/curve_maker/javascripts"
  # TODO: Only for a dev version
  urlArgs: "nocache=" + (new Date()).getTime()
  paths:
    "views": "views"
    "models": "models"
  waitSeconds: 8
  # shim???
  #shim:
  #  'backbone':
  #    deps: ['underscore', 'jquery']
  #    exports: 'Backbone'
  #  'underscore':
  #    exports: '_'

require ["./comp", "./column_manager", "./utils/template_helpers"], (CurveMaker, ColumnManager, TemplateHelpers) ->
  window.TSCreator or= {}
  window.TSCreator.utils or= new TemplateHelpers

  app = new CurveMaker(
    el: $("body")[0]
    columnManager: new ColumnManager()
  ).render()
