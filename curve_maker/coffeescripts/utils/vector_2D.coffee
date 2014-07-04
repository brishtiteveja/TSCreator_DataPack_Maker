define [], () ->
  # This is ported from TSCreator/util/Vector2D.java
  class Vector2D
    constructor: (@x, @y) ->
    
    length: () ->
      Math.sqrt(@x * @x + @y * @y)
    normalize: () ->
      l = @length()
      @x /= l
      @y /= l
      @
    setLength: (l) ->
      mul = l / length()
      @x *= mul
      @y *= mul
      @
    addR: (o) ->
      new Vector2D(@x + o.x, @y + o.y)
    dotProduct: (o) ->
      @x * o.x + @y * o.y
    perpSlope: () ->
      # reciprocal and *-1
      temp = @x
      @x = @y
      @y = temp
      @x *= 1
      @y *= -1
    
