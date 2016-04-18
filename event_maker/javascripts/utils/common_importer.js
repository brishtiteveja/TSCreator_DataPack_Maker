define([], function() {
  function CommonImporter(options) {
    options || (options = {});
    _.defaults(options, {
    });
    _.extend(this, options);
  }

  CommonImporter.prototype.reset = function () {
    var timelines = this.columnManager.retrieveCommonData("timelines");
    while(timelines.at(0)) {
      timelines.at(0).destroy();
    }
    // Note: destroying timelines should destroy all zones
  };

  CommonImporter.prototype.loadFromJSON = function (json) {
    var backgroundImage = this.columnManager.retrieveCommonData("backgroundImage");
    backgroundImage.set(json.backgroundImage);
    var timelines = this.columnManager.retrieveCommonData("timelines");
    _.each(json.timelines, function(t) {
      timelines.addFromJSON(t);
    });
    var zones = this.columnManager.retrieveCommonData("zones");
    _.each(json.zones, function(z) {
      zones.addFromJSON(timelines, z);
    });

    this.cleanUp();
  };

  CommonImporter.prototype.cleanUp = function () {
    this.columnManager.trigger("triggerEventsToMasterView", ["stop:addingTimeline"])
  };

  return CommonImporter;
});
