(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["./models/columns", "./views/timelines", "./models/timelines", "./views/zones", "./models/zones", "./views/ranges", "./models/ranges", "./views/curves", "./models/curves", "./models/points", "./views/image_detail", "./models/background_image", "./utils/common_importer", "./utils/common_exporter", "./utils/curve_importer", "./utils/curve_exporter"], function(ColumnCollection, TimelinesView, TimelineCollection, ZonesView, ZoneCollection, RangesView, RangeCollection, CurvesView, CurveCollection, PointCollection, ImageDetailView, BackgroundImageModel, CommonImporter, CommonExporter, CurveImporter, CurveExporter) {
    var ColumnManager;
    return ColumnManager = (function(_super) {
      __extends(ColumnManager, _super);

      function ColumnManager() {
        this.isCurrentColumnInitialized = __bind(this.isCurrentColumnInitialized, this);
        return ColumnManager.__super__.constructor.apply(this, arguments);
      }

      ColumnManager.prototype.currentColumnIdx = 0;

      ColumnManager.prototype.initialize = function(options) {
        this.initCommonDataModules();
        this.columns = new ColumnCollection([
          {
            _type: "curve"
          }
        ]);
        this.initCurrentDataModules();
        return this;
      };

      ColumnManager.prototype.isCurrentColumnInitialized = function() {
        var currentColumn;
        currentColumn = this.columns.at(this.currentColumnIdx);
        return currentColumn.get("isInitialized");
      };

      ColumnManager.prototype.initCommonDataModules = function() {
        this.commonDataModules = {};
        _.each(this.configs.common.requires, (function(_this) {
          return function(r) {
            var module;
            module = _this.modules[r];
            if (module.dataClazz != null) {
              return _this.commonDataModules[r] = new module.dataClazz;
            }
          };
        })(this));
        return this;
      };

      ColumnManager.prototype.initCurrentDataModules = function() {
        var currentColumn, currentConfig, updates;
        currentColumn = this.columns.at(this.currentColumnIdx);
        currentConfig = this.configs[currentColumn.get("_type")];
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
        updates.isInitialized = true;
        currentColumn.set(updates);
        return this;
      };

      ColumnManager.prototype.getCurrentModulesForDetails = function() {
        var currentColumn, currentConfig;
        currentColumn = this.columns.at(this.currentColumnIdx);
        currentConfig = this.configs[currentColumn.get("_type")];
        return _.map(_.union(this.configs.common.requires, currentConfig.requires), (function(_this) {
          return function(r) {
            return _this.modules[r];
          };
        })(this));
      };

      ColumnManager.prototype.retrieveCurrentDataModule = function(name) {
        var currentColumn, _ref;
        currentColumn = this.columns.at(this.currentColumnIdx);
        return (_ref = currentColumn.get(name)) != null ? _ref : this.commonDataModules[name];
      };

      ColumnManager.prototype.retrieveDataModuleWithIndex = function(idx, name) {
        var thisColumn, _ref;
        thisColumn = this.columns.at(idx);
        return (_ref = thisColumn.get(name)) != null ? _ref : this.commonDataModules[name];
      };

      ColumnManager.prototype.retrieveCommonDataModule = function(name) {
        return this.commonDataModules[name];
      };

      ColumnManager.prototype.registerNotifier = function(notifier) {
        this.notifier = notifier;
      };

      ColumnManager.prototype.getNotifier = function() {
        return this.notifier;
      };

      ColumnManager.prototype.exportAll = function() {
        var commonExporter, output;
        commonExporter = new this.configs.common.exporterClazz({
          columnManager: this
        });
        output = commonExporter.getJSON();
        output._columns = [];
        this.columns.each((function(_this) {
          return function(column, idx) {
            var c, exporter;
            if (column.get("isInitialized")) {
              c = _this.configs[column.get("_type")];
              exporter = new c.exporterClazz({
                columnManager: _this,
                columnIdx: idx
              });
              return output._columns.push(exporter.getJSON());
            }
          };
        })(this));
        return JSON.stringify(output);
      };

      ColumnManager.prototype.exportToFile = function(filename) {
        var $link, blob, data, jsonUrl, url;
        data = this.exportAll();
        url = 'data:text/json;charset=utf8,' + encodeURIComponent(data);
        filename = filename != null ? filename : "TSCreator_curve_" + (new Date().toLocaleDateString("en-US")) + "_" + (+(new Date)) + ".json";
        blob = new Blob([data], {
          type: 'application/json'
        });
        jsonUrl = URL.createObjectURL(blob);
        $link = $("<a/>").attr({
          'download': filename,
          'href': jsonUrl
        });
        $link[0].click();
        $link.remove();
        return this;
      };

      ColumnManager.prototype.importAll = function(json) {
        var commonImporter;
        commonImporter = new this.configs.common.importerClazz({
          columnManager: this
        });
        commonImporter.reset();
        commonImporter.loadFromJSON(json);
        _.each(json._columns, (function(_this) {
          return function(columnJSON, idx) {
            var c, importer;
            c = _this.configs[columnJSON._type];
            importer = new c.importerClazz({
              columnManager: _this,
              columnIdx: idx
            });
            importer.reset();
            return importer.loadFromJSON(columnJSON);
          };
        })(this));
        return this;
      };

      ColumnManager.prototype.configs = {
        common: {
          requires: ["timelines", "zones", "backgroundImage", "referenceColumns"],
          importerClazz: CommonImporter,
          exporterClazz: CommonExporter
        },
        curve: {
          requires: ["ranges", "curves", "defaults", "chartSettings"],
          importerClazz: CurveImporter,
          exporterClazz: CurveExporter
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
