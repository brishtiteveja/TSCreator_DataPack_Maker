(function() {
  require.config({
    baseUrl: "../curve_maker/javascripts",
    urlArgs: "nocache=" + (new Date()).getTime(),
    paths: {
      "views": "views",
      "models": "models"
    },
    waitSeconds: 15
  });

  require(["./comp", "./column_manager", "./utils/template_helpers", "./utils/math_helpers", "./utils/color_helpers", "./utils/curve_smoothing"], function(Maker, ColumnManager, TemplateHelpers, MathHelpers, ColorHelpers, CurveSmoothing) {
    var app, _base, _base1, _base2, _base3, _base4;
    if (window.TSCreator == null) {
      window.TSCreator = {};
    }
    if ((_base = window.TSCreator).utils == null) {
      _base.utils = {};
    }
    if ((_base1 = window.TSCreator.utils).templatehelpers == null) {
      _base1.templatehelpers = new TemplateHelpers;
    }
    if ((_base2 = window.TSCreator.utils).math == null) {
      _base2.math = new MathHelpers;
    }
    if ((_base3 = window.TSCreator.utils).color == null) {
      _base3.color = new ColorHelpers;
    }
    if ((_base4 = window.TSCreator.utils).curvesmoothing == null) {
      _base4.curvesmoothing = new CurveSmoothing;
    }
    return app = new Maker({
      el: $("body")[0],
      columnManager: new ColumnManager()
    }).render();
  });

}).call(this);
