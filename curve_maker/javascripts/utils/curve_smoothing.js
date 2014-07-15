define(["./vector_2D"], function(Vector2D) {
  function CurveSmoothing(options) {
    options || (options = {});
    _.defaults(options, {
      CONTROL_POINT_LENGTH: 0.4,
      MIN_CONTROL_POINT_LENGTH: 0.001,
      MAX_CONTROL_POINT_LENGTH: 10
    });
    _.extend(this, options);
  }

  CurveSmoothing.prototype.getControlPointForVerticalCurves = function(points, lineTo, i, dir) {
    // Note: here lineTo is a single boolean value instead of array of booleans (in Java implementation)
    var derivative;
    var ret = [];
    
    // first point, dir assumed to be 1
    // last point, dir assumed to be -1
    if (i == 0 || i >= (points.length - 1) || lineTo) {
      var v = this.getControlPoint(points, lineTo, i, dir, false, true);

      ret[0] = v.x;
      ret[1] = v.y;

      return ret;
    }

    // Note: these variables are used pretty much the same as in getControlPoint
    // The code may be simplified if we change what we pass in for getControlPoint function
    // and how we deal with the first and last points...
    var prevPoint = points.at(i-1);
    var currPoint = points.at(i);
    var nextPoint = points.at(i+1);
    
    var prevx = prevPoint.get("x"), prevy = prevPoint.get("y");
    var currx = currPoint.get("x"), curry = currPoint.get("y");
    var nextx = nextPoint.get("x"), nexty = nextPoint.get("y");

    var prevdiff = prevx - currx;
    var nextdiff = nextx - currx;

    if (prevdiff * nextdiff > 0) {
      derivative = Number.MAX_VALUE; // this point is either a maximum or a minimum
    } else {
      derivative = (nextx - prevx) / (nexty - prevy);

      var derivativeNext = (nextx - currx) / (nexty - curry);
      var derivativePrev = (currx - prevx) / (curry - prevy);

      if (derivative < 0) {
        derivative = Math.max(derivative, derivativeNext);
      }
      if (derivative > 0) {
        derivative = Math.max(derivative, derivativePrev);
      }
    }

    if (dir > 0) {
      // towards i+1
      if (!isFinite(derivative)) {
        ret[0] = currx;
        ret[1] = curry * (1 - this.CONTROL_POINT_LENGTH) + nexty * this.CONTROL_POINT_LENGTH;
      } else {
        var v = this.getControlPoint(points, lineTo, i, dir, false, true);

        ret[0] = v.x;
        ret[1] = v.y;
      }
    } else {
      // towards i-1
      if (!isFinite(derivative)) {
        ret[0] = currx;
        ret[1] = curry * (1 - this.CONTROL_POINT_LENGTH) + prevy * this.CONTROL_POINT_LENGTH;
      } else {
        var v = this.getControlPoint(points, lineTo, i, dir, false, true);

        ret[0] = v.x;
        ret[1] = v.y;
      }
    }
    return ret;
  };

  CurveSmoothing.prototype.getControlPoint = function(points, sharp,/*sharpA,*/ i, dir, closed, forVertical) {
    // Note: small modification to directly pass in sharp instead of sharpA as a parameter
    //boolean sharp = sharpA[i];

    // TODO: Why do we need this safe guard???
    //if (i == 0 && !closed) {
    //  dir = 1;
    //  sharp = true;
    //}
    //if (i == points.length - 1 && !closed) {
    //  dir = -1;
    //  sharp = true;
    //}

    var previ = (i - 1 + points.length) % points.length;
    var nexti = (i + 1) % points.length;
    var prevPoint = points.at(previ);
    var currPoint = points.at(i);
    var nextPoint = points.at(nexti);

    var prev = new Vector2D(prevPoint.get("x") - currPoint.get("x"), prevPoint.get("y") - currPoint.get("y"));
    var next = new Vector2D(nextPoint.get("x") - currPoint.get("x"), nextPoint.get("y") - currPoint.get("y"));

    var prevLength = prev.length();
    var nextLength = next.length();

    // see if the two points are on top of each other
    // if they are, punish the user with a squiggle
    if (prevLength == 0) {
      prev = new Vector2D(0, 1);
      prevLength = 1;
    }
    if (nextLength == 0) {
      next = new Vector2D(1, 0);
      nextLength = 1;
    }

    if (sharp) {
      if (dir > 0) {
        next.setLength(Math.min(nextLength * this.CONTROL_POINT_LENGTH, this.MAX_CONTROL_POINT_LENGTH));
        next.add(currPoint.get("x"), currPoint.get("y"));
        return next;
      } else {
        prev.setLength(Math.min(prevLength * this.CONTROL_POINT_LENGTH, this.MAX_CONTROL_POINT_LENGTH));
        prev.add(currPoint.get("x"), currPoint.get("y"));
        return prev;
      }
    }

    prev.normalize();
    next.normalize();

    var mid = prev.addR(next);

    var end1, end2;

    if (mid.length() > 0.01) {
      mid.normalize();
      mid.perpSlope();

      end1 = mid;
      end2 = new Vector2D(end1);
      end2.mul(-1);
    } else {
      // the two are almost at 180 degrees. poor accuracy here,
      // so calculate in another way.
      var minus = new Vector2D(next);
      minus.mul(-1);

      end1 = minus.addR(prev);
      end2 = new Vector2D(end1);
      end2.mul(-1);
    }

    if (prev.dotProduct(end1) > 0) {
      // prev = end1, next = end2
      end1.setLength(this.getControlPointLength(prev, next, prevLength, nextLength, forVertical));
      end2.setLength(this.getControlPointLength(next, prev, nextLength, prevLength, forVertical));

      end1.add(currPoint.get("x"), currPoint.get("y"));
      end2.add(currPoint.get("x"), currPoint.get("y"));

      if (dir > 0) {
        return end2;
      } else {
        return end1;
      }
    } else {
      // prev = end2, next = end1
      end2.setLength(this.getControlPointLength(prev, next, prevLength, nextLength, forVertical));
      end1.setLength(this.getControlPointLength(next, prev, nextLength, prevLength, forVertical));

      end1.add(currPoint.get("x"), currPoint.get("y"));
      end2.add(currPoint.get("x"), currPoint.get("y"));

      if (dir > 0) {
        return end1;
      } else {
        return end2;
      }
    }
  };

  CurveSmoothing.prototype.getControlPointLength = function(thisSeg, otherSeg, thisSegLength, otherSegLength, forVertical) {
    var thisSegL = Math.max(thisSeg.length(), 0.0001);
    var otherSegL = Math.max(otherSeg.length(), 0.0001);
    var cos = Math.abs(thisSeg.dotProduct(otherSeg) / (thisSegL * otherSegL));
    if (!forVertical && cos < 0.5) {
      cos = 1 - cos;
    }

    var ret = Math.min(Math.max(thisSegLength * this.CONTROL_POINT_LENGTH * cos, this.MIN_CONTROL_POINT_LENGTH), this.MAX_CONTROL_POINT_LENGTH);
    return ret;
  };

  return CurveSmoothing;
});
