define([], function() {
  function CurveImporter(options) {
    options || (options = {});
    _.defaults(options, {
    });
    _.extend(this, options);
  }

  CurveImporter.prototype.reset = function(columnIdx) {
    if(columnIdx == null) { columnIdx = this.columnIdx; }
    var curves = this.columnManager.retrieveDataWithColumnIndex(columnIdx, "curves");
    while(curves.at(0)) {
      curves.at(0).destroy();
    }
    var ranges = this.columnManager.retrieveDataWithColumnIndex(columnIdx, "ranges");
    while(ranges.at(0)) {
      ranges.at(0).destroy();
    }
  };

  CurveImporter.prototype.loadFromJSON = function (json, columnIdx) {
    if(columnIdx == null) { columnIdx = this.columnIdx; }
    var ranges = this.columnManager.retrieveDataWithColumnIndex(columnIdx, "ranges");
    _.each(json.ranges, function(r) {
      ranges.addFromJSON(r);
    });
    var curves = this.columnManager.retrieveDataWithColumnIndex(columnIdx, "curves");
    var timelines = this.columnManager.retrieveCommonData("timelines");
    var zones = this.columnManager.retrieveCommonData("zones");
    _.each(json.curves, function(curve) {
      var newCurve = curves.addNew();
      _.each(curve.points, function(p) {
        newCurve.addPointFromJSON(timelines, zones, p);
      });
      _.each(curve.lines, function(l) {
        newCurve.addLineFromJSON(l);
      });
      newCurve.get("option").set(curve.option);
    });

    this.cleanUp();
  };

  CurveImporter.prototype.cleanUp = function () {
    this.columnManager.trigger("triggerEventsToMasterView", ["stop:addingRange", "stop:addingCurve"])
  };

  return CurveImporter;
});
