define ["./curve", "./points", "./lines"], (Curve, Points, Lines) ->
  class Curves extends Backbone.Collection
    model: Curve
    addWithFirstPoint: (p) ->
      newPoints = new Points()
      newPoints.add(p)
      newLines = new Lines()
      @add(
        points: newPoints
        lines: newLines
      )
