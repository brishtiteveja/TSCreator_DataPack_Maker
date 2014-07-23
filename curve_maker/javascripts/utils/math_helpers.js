define([], function() {
  function MathHelpers(options) {
      options || (options = {});
    _.defaults(options, {
    });
    _.extend(this, options);
  }

  // Simple rounding solution for common JS rounding issue...
  // http://www.jacklmoore.com/notes/rounding-in-javascript/
  MathHelpers.prototype.round = function(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
  };
  // round up to second decimal point
  MathHelpers.prototype.roundD2 = function(value) { return this.round(value, 2); }
  MathHelpers.prototype.roundD4 = function(value) { return this.round(value, 4); }
  MathHelpers.prototype.roundD6 = function(value) { return this.round(value, 6); }

  return MathHelpers;
});
