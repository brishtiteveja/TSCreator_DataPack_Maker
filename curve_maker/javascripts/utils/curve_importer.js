define([], function() {
  function CurveImporter(options) {
    options || (options = {});
    _.defaults(options, {
    });
    _.extend(this, options);
  }

  CurveImporter.prototype.reset = function(columnIdx) {
    if(columnIdx == null) { columnIdx = this.columnIdx; }
    var ranges = this.columnManager.retrieveDataModuleWithIndex(columnIdx, "ranges");
    while(ranges.at(0)) {
      ranges.at(0).destroy();
    }
    var curves = this.columnManager.retrieveDataModuleWithIndex(columnIdx, "curves");
    while(curves.at(0)) {
      curves.at(0).destroy();
    }
  };

  CurveImporter.prototype.loadFromJSON = function (json, columnIdx) {
    if(columnIdx == null) { columnIdx = this.columnIdx; }
    var ranges = this.columnManager.retrieveDataModuleWithIndex(columnIdx, "ranges");
    _.each(json.ranges, function(r) {
      ranges.addFromJSON(r);
    });
    var curves = this.columnManager.retrieveDataModuleWithIndex(columnIdx, "curves");
    _.each(json.curves, function(curve) {
      var newCurve = curves.addNew();
      _.each(curve.points, function(p) {
        newCurve.addPointFromJSON(p);
      });
      _.each(curve.lines, function(l) {
        newCurve.addLineFromJSON(l);
      });
    });
  };

  return CurveImporter;
});
