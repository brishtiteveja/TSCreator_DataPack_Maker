define([], function() {
  function CurveExporter(options) {
    options || (options = {});
    _.defaults(options, {
    });
    _.extend(this, options);
  }

  CurveExporter.prototype.getJSON = function (columnIdx) {
    if(columnIdx == null) { columnIdx = this.columnIdx; }
    var output = {};
    output.ranges = this.columnManager.retrieveDataModuleWithIndex(columnIdx, "ranges");
    output.curves = this.columnManager.retrieveDataModuleWithIndex(columnIdx, "curves");
    output._type = "curve";
    return output;
  };

  return CurveExporter;
});
