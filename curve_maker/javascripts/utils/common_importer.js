define([], function() {
  function CommonImporter(options) {
    options || (options = {});
    _.defaults(options, {
    });
    _.extend(this, options);
  }

  CommonImporter.prototype.reset = function () {
    var timelines = this.columnManager.retrieveCommonDataModule("timelines");
    while(timelines.at(0)) {
      timelines.at(0).destroy();
    }
    // Note: destroying timelines should destroy all zones
  };

  CommonImporter.prototype.loadFromJSON = function (json) {
    var backgroundImage = this.columnManager.retrieveCommonDataModule("backgroundImage");
    backgroundImage.set(json.backgroundImage);
    var timelines = this.columnManager.retrieveCommonDataModule("timelines");
    _.each(json.timelines, function(t) {
      timelines.addFromJSON(t);
    });
    var zones = this.columnManager.retrieveCommonDataModule("zones");
    _.each(json.zones, function(z) {
      zones.addFromJSON(timelines, z);
    });
  };

  return CommonImporter;
});
