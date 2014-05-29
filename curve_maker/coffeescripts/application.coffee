require.config
  baseUrl: "/curve_maker/javascripts"
  paths:
    "views": "views"
    "models": "models"
  waitSeconds: 8
  shim:
    'backbone':
      deps: ['underscore', 'jquery']
      exports: 'Backbone'
    'underscore':
      exports: '_'

require ["comp"], (CurveMaker) ->
  app = new CurveMaker(
    el: $("body")[0]
  ).render()
