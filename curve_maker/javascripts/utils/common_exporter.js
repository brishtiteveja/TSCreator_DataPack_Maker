define([], function() {
  function CommonExporter(options) {
    options || (options = {});
    _.defaults(options, {
    });
    _.extend(this, options);
  }

  CommonExporter.prototype.getJSON = function () {
    var output = {};
    output.backgroundImage = this.columnManager.retrieveCommonDataModule("backgroundImage");
    output.timelines = this.columnManager.retrieveCommonDataModule("timelines");
    output.zones = this.columnManager.retrieveCommonDataModule("zones");
    return output;
  };

  return CommonExporter;
});
