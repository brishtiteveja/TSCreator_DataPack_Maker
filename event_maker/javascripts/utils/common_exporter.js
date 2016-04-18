define([], function() {
  function CommonExporter(options) {
    options || (options = {});
    _.defaults(options, {
    });
    _.extend(this, options);
  }

  CommonExporter.prototype.getJSON = function () {
    var output = {};
    output.backgroundImage = this.columnManager.retrieveCommonData("backgroundImage");
    output.timelines = this.columnManager.retrieveCommonData("timelines");
    output.zones = this.columnManager.retrieveCommonData("zones");
    return output;
  };

  return CommonExporter;
});
