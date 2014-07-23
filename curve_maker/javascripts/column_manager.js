(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["./models/columns", "./views/timelines", "./models/timelines", "./views/zones", "./models/zones", "./views/ranges", "./models/ranges", "./views/curves", "./models/curves", "./models/points", "./views/image_detail", "./models/background_image"], function(ColumnCollection, TimelinesView, TimelineCollection, ZonesView, ZoneCollection, RangesView, RangeCollection, CurvesView, CurveCollection, PointCollection, ImageDetailView, BackgroundImageModel) {
    var ColumnManager;
    return ColumnManager = (function(_super) {
      __extends(ColumnManager, _super);

      function ColumnManager() {
        this.getNotifier = __bind(this.getNotifier, this);
        this.registerNotifier = __bind(this.registerNotifier, this);
        this.retrieveCurrentDataModule = __bind(this.retrieveCurrentDataModule, this);
        this.getCurrentModulesForDetails = __bind(this.getCurrentModulesForDetails, this);
        this.initCurrentDataModules = __bind(this.initCurrentDataModules, this);
        return ColumnManager.__super__.constructor.apply(this, arguments);
      }

      ColumnManager.prototype.currentColumnIdx = 0;

      ColumnManager.prototype.initialize = function(options) {
        this.columns = new ColumnCollection([
          {
            type: "curve"
          }
        ]);
        this.initCurrentDataModules();
        return this;
      };

      ColumnManager.prototype.initCurrentDataModules = function() {
        var currentColumn, currentConfig, updates;
        currentColumn = this.columns.at(this.currentColumnIdx);
        currentConfig = this.configs[currentColumn.get("type")];
        updates = {};
        _.each(currentConfig.requires, (function(_this) {
          return function(r) {
            var module;
            module = _this.modules[r];
            if (module.dataClazz != null) {
              return updates[r] = new module.dataClazz;
            }
          };
        })(this));
        currentColumn.set(updates);
        return this;
      };

      ColumnManager.prototype.getCurrentModulesForDetails = function() {
        var currentColumn, currentConfig;
        currentColumn = this.columns.at(this.currentColumnIdx);
        currentConfig = this.configs[currentColumn.get("type")];
        return _.map(currentConfig.requires, (function(_this) {
          return function(r) {
            return _this.modules[r];
          };
        })(this));
      };

      ColumnManager.prototype.retrieveCurrentDataModule = function(name) {
        var currentColumn;
        currentColumn = this.columns.at(this.currentColumnIdx);
        return currentColumn.get(name);
      };

      ColumnManager.prototype.registerNotifier = function(notifier) {
        this.notifier = notifier;
      };

      ColumnManager.prototype.getNotifier = function() {
        return this.notifier;
      };

      ColumnManager.prototype.configs = {
        curve: {
          requires: ["timelines", "zones", "ranges", "curves", "backgroundImage", "referenceColumns", "defaults", "chartSettings"]
        }
      };

      ColumnManager.prototype.modules = {
        timelines: {
          text: "Time Lines",
          title: "Show time line details",
          viewClazz: TimelinesView,
          dataClazz: TimelineCollection
        },
        zones: {
          text: "Zones",
          title: "Show zone details",
          viewClazz: ZonesView,
          dataClazz: ZoneCollection
        },
        ranges: {
          text: "Range",
          title: "Show range limit details",
          template: new EJS({
            url: "templates/ranges/show"
          }),
          viewClazz: RangesView,
          dataClazz: RangeCollection
        },
        curves: {
          text: "Curves",
          title: "Show curve details",
          viewClazz: CurvesView,
          dataClazz: CurveCollection
        },
        backgroundImage: {
          text: "Image",
          title: "Set up background image",
          template: new EJS({
            url: "templates/image/show"
          }),
          viewClazz: ImageDetailView,
          dataClazz: BackgroundImageModel
        },
        referenceColumns: {
          text: "References",
          title: "Set reference columns"
        },
        defaults: {
          text: "Defaults",
          title: "Defaults..."
        },
        chartSettings: {
          text: "Chart Setting",
          title: "Set chart settings"
        }
      };

      return ColumnManager;

    })(Backbone.Model);
  });

}).call(this);
