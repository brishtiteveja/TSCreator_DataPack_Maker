(function() {
  require.config({
    baseUrl: "/curve_maker/javascripts",
    urlArgs: "nocache=" + (new Date()).getTime(),
    paths: {
      "views": "views",
      "models": "models"
    },
    waitSeconds: 8
  });

  require(["./comp", "./column_manager", "./utils/template_helpers"], function(CurveMaker, ColumnManager, TemplateHelpers) {
    var app, _base;
    window.TSCreator || (window.TSCreator = {});
    (_base = window.TSCreator).utils || (_base.utils = new TemplateHelpers);
    return app = new CurveMaker({
      el: $("body")[0],
      columnManager: new ColumnManager()
    }).render();
  });

}).call(this);
