(function() {
  define(["./models/columns", "./views/timelines", "./models/timelines", "./views/zones", "./models/zones", "./views/ranges", "./models/ranges", "./views/curves", "./models/curves", "./models/points", "./views/image_detail", "./models/background_image", "./views/references_detail", "./models/references_detail", "./utils/common_importer", "./utils/common_exporter", "./utils/curve_importer", "./utils/curve_exporter", "./views/curve_export"], function(ColumnCollection, TimelinesView, TimelineCollection, ZonesView, ZoneCollection, RangesView, RangeCollection, CurvesView, CurveCollection, PointCollection, ImageDetailView, BackgroundImageModel, ReferencesDetailView, ReferencesDetailModel, CommonImporter, CommonExporter, CurveImporter, CurveExporter, CurveExportView) {
    var ColumnManager;
    return ColumnManager = (function() {
      function ColumnManager(options) {
        _.extend(this, Backbone.Events);
        this.currentColumnIdx = null;
        this.initCommonDataModules();
        this.columns = new ColumnCollection;
        this.listenTo(this.columns, "add", this.addOne);
        this.initReferenceTimelinesAndZones();
      }

      ColumnManager.prototype.addOne = function(m, c, options) {
        this.currentColumnIdx = c.indexOf(m);
        this.initCurrentDataModules();
        this.initImportAndExportEvents();
        return this;
      };

      ColumnManager.prototype.removeOne = function(m, c, options) {
        return this;
      };

      ColumnManager.prototype.isCurrentColumnInitialized = function() {
        var currentColumn;
        currentColumn = this.columns.at(this.currentColumnIdx);
        return currentColumn.get("isInitialized");
      };

      ColumnManager.prototype.initCommonDataModules = function() {
        this.commonDataModules = {};
        _.each(this.configs.common.requiresModules, (function(_this) {
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
        currentColumn = this.getCurrentColumn();
        currentConfig = this.configs[currentColumn.get("_type")];
        updates = {};
        _.each(currentConfig.requiresModules, (function(_this) {
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

      ColumnManager.prototype.getCurrentColumn = function() {
        return this.columns.at(this.currentColumnIdx);
      };

      ColumnManager.prototype.getColumnWithColumnIndex = function(idx) {
        return this.columns.at(idx);
      };

      ColumnManager.prototype.getExportViewClazzForCurrentColumn = function() {
        var currentColumn, currentConfig;
        currentColumn = this.getCurrentColumn();
        currentConfig = this.configs[currentColumn.get("_type")];
        return currentConfig.exportViewClazz;
      };

      ColumnManager.prototype.getExportViewClazzWithColumnIndex = function(idx) {
        var thisColumn, thisConfig;
        thisColumn = this.columns.at(idx);
        thisConfig = this.configs[thisColumn.get("_type")];
        return thisConfig.exportViewClazz;
      };

      ColumnManager.prototype.getAllToolsForCurrentColumn = function() {
        var currentColumn, currentConfig;
        currentColumn = this.getCurrentColumn();
        currentConfig = this.configs[currentColumn.get("_type")];
        return _.map(_.union(this.configs.common.requiresTools, currentConfig.requiresTools), (function(_this) {
          return function(r) {
            return _this.tools[r];
          };
        })(this));
      };

      ColumnManager.prototype.getAllToolsWithColumnIndex = function(idx) {
        var thisColumn, thisConfig;
        thisColumn = this.columns.at(idx);
        thisConfig = this.configs[thisColumn.get("_type")];
        return _.map(_.union(this.configs.common.requiresTools, thisConfig.requiresTools), (function(_this) {
          return function(r) {
            return _this.tools[r];
          };
        })(this));
      };

      ColumnManager.prototype.getAllModulesForCurrentColumn = function() {
        var currentColumn, currentConfig;
        currentColumn = this.getCurrentColumn();
        currentConfig = this.configs[currentColumn.get("_type")];
        return _.map(_.union(this.configs.common.requiresModules, currentConfig.requiresModules), (function(_this) {
          return function(r) {
            return _this.modules[r];
          };
        })(this));
      };

      ColumnManager.prototype.getAllModulesWithColumnIndex = function(idx) {
        var thisColumn, thisConfig;
        thisColumn = this.columns.at(idx);
        thisConfig = this.configs[thisColumn.get("_type")];
        return _.map(_.union(this.configs.common.requiresModules, thisConfig.requiresModules), (function(_this) {
          return function(r) {
            return _this.modules[r];
          };
        })(this));
      };

      ColumnManager.prototype.retrieveCommonData = function(name) {
        return this.commonDataModules[name];
      };

      ColumnManager.prototype.retrieveDataForCurrentColumn = function(name) {
        var currentColumn, _ref;
        currentColumn = this.getCurrentColumn();
        return (_ref = currentColumn.get(name)) != null ? _ref : this.commonDataModules[name];
      };

      ColumnManager.prototype.retrieveDataWithColumnIndex = function(idx, name) {
        var thisColumn, _ref;
        thisColumn = this.columns.at(idx);
        return (_ref = thisColumn.get(name)) != null ? _ref : this.commonDataModules[name];
      };

      ColumnManager.prototype.registerNotifier = function(notifier) {
        this.notifier = notifier;
      };

      ColumnManager.prototype.getNotifier = function() {
        return this.notifier;
      };

      ColumnManager.prototype.initImportAndExportEvents = function() {
        this.listenTo(this, "saveToLocalJSON", this.exportToFile);
        this.listenTo(this, "loadFromLocalJSON", this.importAll);
        return this;
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

      ColumnManager.prototype.initReferenceTimelinesAndZones = function() {
        $.ajax({
          dataType: "json",
          url: "javascripts/utils/reference_timelines_and_zones.min.json",
          success: (function(_this) {
            return function(data) {
              return _this.referenceTimelinesAndZones = data;
            };
          })(this)
        });
        return this;
      };

      ColumnManager.prototype.getReferenceTimelinesAndZones = function() {
        return this.referenceTimelinesAndZones;
      };

      ColumnManager.prototype.configs = {
        common: {
          requiresTools: ["pointer", "lockCursorH", "lockCursorV", "zoomIn", "zoomOut", "pan", "addTimeline"],
          requiresModules: ["timelines", "zones", "backgroundImage", "referenceColumns"],
          importerClazz: CommonImporter,
          exporterClazz: CommonExporter
        },
        curve: {
          requiresTools: ["addRanges", "addCurve", "showReferencePanel", "saveToLocalStorage", "reloadData", "exportData", "dataSandbox"],
          requiresModules: ["ranges", "curves", "defaults", "chartSettings"],
          importerClazz: CurveImporter,
          exporterClazz: CurveExporter,
          exportViewClazz: CurveExportView
        }
      };

      ColumnManager.prototype.tools = {
        pointer: {
          name: "pointer",
          action: {
            type: "toggle",
            groupId: 1,
            startEvent: "noop",
            stopEvent: "noop"
          },
          title: "mouse pointer"
        },
        lockCursorH: {
          name: "lock-cursor-h",
          action: {
            type: "toggle",
            groupId: 2,
            startEvent: "noop",
            stopEvent: "noop"
          },
          title: "lock cursor in X."
        },
        lockCursorV: {
          name: "lock-cursor-v",
          action: {
            type: "toggle",
            groupId: 2,
            startEvent: "noop",
            stopEvent: "noop"
          },
          title: "lock cursor in V."
        },
        zoomIn: {
          name: "zoom-in",
          action: {
            type: "click",
            event: "zoomIn"
          },
          title: "zoom in"
        },
        zoomOut: {
          name: "zoom-out",
          action: {
            type: "click",
            event: "zoomOut"
          },
          title: "zoom out"
        },
        pan: {
          name: "pan",
          action: {
            type: "toggle",
            groupId: 1,
            startEvent: "start:panning",
            stopEvent: "stop:panning"
          },
          title: "move"
        },
        addTimeline: {
          name: "add-timeline",
          action: {
            type: "toggle",
            groupId: 1,
            startEvent: "start:addingTimeline",
            stopEvent: "stop:addingTimeline"
          },
          title: "create a new timeline"
        },
        addRanges: {
          name: "add-range-lines",
          action: {
            type: "toggle",
            groupId: 1,
            startEvent: "start:addingRange",
            stopEvent: "stop:addingRange"
          },
          title: "Set up range limits"
        },
        addCurve: {
          name: "add-new-curve",
          action: {
            type: "toggle",
            groupId: 1,
            startEvent: "start:addingCurve",
            stopEvent: "stop:addingCurve"
          },
          title: "Add a new curve"
        },
        showReferencePanel: {
          name: "show-ref-panel",
          action: {
            type: "toggle",
            groupId: 3,
            startEvent: "show:refZones",
            stopEvent: "hide:refZones"
          },
          title: "show reference panel"
        },
        saveToLocalStorage: {
          name: "save-to-local-storage",
          action: {
            type: "click",
            event: "saveToLocalJSON"
          },
          title: "save to local storage"
        },
        reloadData: {
          name: "reload-data",
          action: {
            type: "click",
            event: "quickReload"
          },
          title: "reload data from local storage"
        },
        exportData: {
          name: "export-data",
          action: {
            type: "toggle",
            groupId: 1,
            startEvent: "show:columnExportPreview",
            stopEvent: "hide:columnExportPreview"
          },
          title: "export data"
        },
        dataSandbox: {
          name: "file-system",
          action: {
            type: "toggle",
            groupId: 1,
            startEvent: "start:dataSandbox",
            stopEvent: "stop:dataSandbox"
          },
          title: "sandbox"
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
          title: "Set reference columns",
          template: new EJS({
            url: "templates/references/show"
          }),
          viewClazz: ReferencesDetailView,
          dataClazz: ReferencesDetailModel
        },
        defaults: {
          text: "Defaults",
          title: "Defaults..."
        },
        chartSettings: {
          text: "Chart Settings",
          title: "Set chart settings"
        }
      };

      return ColumnManager;

    })();
  });

}).call(this);
