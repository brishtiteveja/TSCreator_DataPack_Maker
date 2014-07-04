define ["./option"], (Option) ->
  class CurveOption extends Option
    defaults:
      isSmoothed: false
      isShowPoints: true
      isShowLines: true
      isFillCurve: true
      fillColor: "#A0EEEE"
