(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["./option"], function(Option) {
    var CurveOption;
    return CurveOption = (function(_super) {
      __extends(CurveOption, _super);

      function CurveOption() {
        return CurveOption.__super__.constructor.apply(this, arguments);
      }

      CurveOption.prototype.defaults = {
        name: "Option " + (_.uniqueId()),
        isSmoothed: true,
        isShowPoints: true,
        isShowLines: false,
        isFillCurve: false,
        fillColor: "#A0EEEE",
        eventType: "LAD",
        eventAge: 0, 
        eventPopup: "",
        eventLineType: "solid",
        imageFileEvent: null 
      };

      return CurveOption;

    })(Option);
  });

}).call(this);
