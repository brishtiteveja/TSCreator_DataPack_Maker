(function() {
  require.config({
    baseUrl: "/curve_maker/javascripts",
    paths: {
      "views": "views",
      "models": "models"
    },
    waitSeconds: 8,
    shim: {
      'backbone': {
        deps: ['underscore', 'jquery'],
        exports: 'Backbone'
      },
      'underscore': {
        exports: '_'
      }
    }
  });

  require(["comp"], function(CurveMaker) {
    var app;
    return app = new CurveMaker({
      el: $("body")[0]
    }).render();
  });

}).call(this);
