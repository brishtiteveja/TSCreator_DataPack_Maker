define([], function() {
  function Vector2D(_x, _y) {
    var o;
    if (arguments.length > 1) {
      this.x = _x;
      this.y = _y;
    } else {
      o = _x;
      this.x = o.x;
      this.y = o.y;
    }
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
    mul = l / this.length();
    this.x *= mul;
    this.y *= mul;
    return this;
  };

  Vector2D.prototype.mul = function(factor) {
    this.x *= factor;
    this.y *= factor;
    return this;
  };

  Vector2D.prototype.addR = function(o) {
    return new Vector2D(this.x + o.x, this.y + o.y);
  };

  Vector2D.prototype.add = function(_x, _y) {
    var o;
    if (arguments.length > 1) {
      this.x += _x;
      this.y += _y;
    } else {
      o = _x;
      this.x += o.x;
      this.y += o.y;
    }
    return this;
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
    this.y *= -1;
    return this;
  };

  return Vector2D;

});

