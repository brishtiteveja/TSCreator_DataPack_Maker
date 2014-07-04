(function() {
  define([], function() {
    var Vector2D;
    return Vector2D = (function() {
      function Vector2D(x, y) {
        this.x = x;
        this.y = y;
      }

      Vector2D.prototype.length = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
      };

      Vector2D.prototype.normalize = function() {
        var l;
        l = this.length();
        this.x /= l;
        this.y /= l;
        return this;
      };

      Vector2D.prototype.setLength = function(l) {
        var mul;
        mul = l / length();
        this.x *= mul;
        this.y *= mul;
        return this;
      };

      Vector2D.prototype.addR = function(o) {
        return new Vector2D(this.x + o.x, this.y + o.y);
      };

      Vector2D.prototype.dotProduct = function(o) {
        return this.x * o.x + this.y * o.y;
      };

      Vector2D.prototype.perpSlope = function() {
        var temp;
        temp = this.x;
        this.x = this.y;
        this.y = temp;
        this.x *= 1;
        return this.y *= -1;
      };

      return Vector2D;

    })();
  });

}).call(this);
