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
    output.ranges = this.columnManager.retrieveDataWithColumnIndex(columnIdx, "ranges");
    output.curves = this.columnManager.retrieveDataWithColumnIndex(columnIdx, "curves");
    output._type = "curve";
    return output;
  };

  return CurveExporter;
});
