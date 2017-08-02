(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["./views/notifications", "./views/main_canvas", "./views/tools", "./views/detail_buttons", "./views/details", "./views/reference_zones"], function(NotificationsView, MainCanvasView, ToolsView, DetailButtonsView, DetailsView, ReferenceZonesView) {
    var Maker;
    return Maker = (function(_super) {
      __extends(Maker, _super);

      function Maker() {
        this.addExportView = __bind(this.addExportView, this);
        this.initReferenceZonesView = __bind(this.initReferenceZonesView, this);
        this.proxyListenTo = __bind(this.proxyListenTo, this);
        this.render = __bind(this.render, this);
        this.disableDefaultFileDrop = __bind(this.disableDefaultFileDrop, this);
        this.resize = __bind(this.resize, this);
        return Maker.__super__.constructor.apply(this, arguments);
      }

      Maker.prototype.initialize = function(options) {
        var debouncedResize;
		// Getting the column manager
        this.columnManager = options.columnManager;

		// creating new notifications view
        this.notificationsView = new NotificationsView({
          className: "notifications"
        }).render();

        this.proxyListenTo(this, "showInfo", this.notificationsView);

		// connecting the notifications view with the column manager
        this.columnManager.registerNotifier(this.notificationsView);

		// creating new main canvas and passing this object as it's master view
        this.mainCanvasView = new MainCanvasView({
          className: "col1 disable-user-select",
          masterView: this
        }).render();

		// initializing reference zones view
        this.referenceZonesView = this.initReferenceZonesView();

		// adding the export view to the column
        this.listenTo(this.columnManager.columns, "add", this.addExportView);
        this.columnManager.columns.add({
          _type: "curve"
        });

		// Creating the tools view for all the tools in the left hand side
        this.toolsView = new ToolsView({
          className: "col2 toolbar",
          columnManager: this.columnManager
        }).render();

		// triggering tool clicking event from column manager to the master view
        this.listenTo(this.columnManager, "triggerEventsToMasterView", (function(_this) {
          return function(events) {
            return _.each(events, function(event) {
              return _this.toolsView.trigger(event);
            });
          };
        })(this));

		// creating the detail pane (the views in the right hand side of the canvas)
        this.detailsView = new DetailsView({
          className: "detail-panels",
          mainCanvasView: this.mainCanvasView,
          columnManager: this.columnManager
        }).render();

		// creating new detail buttons view
        this.detailButtonsView = new DetailButtonsView({
          className: "detail-buttons",
          collection: this.detailsView.collection
        }).render();

		// Setting up the events occured by tool clicking in the tool view to the main canvas
        this.setUpProxyEvents();

        debouncedResize = _.debounce(this.resize, 150);
        $(window).resize(debouncedResize);

		//disabling default file drop
        this.disableDefaultFileDrop();
		
		// Making a maker attribute for window with this object
        window.maker = this;

        return this;
      };

      Maker.prototype.resize = function() {
        var heightOnlyDimension, mainCanvasDimension;
        heightOnlyDimension = {
          height: $(window).height()
        };
        this.toolsView.resize(heightOnlyDimension);
        this.detailButtonsView.resize(heightOnlyDimension);
        this.detailsView.resize(heightOnlyDimension);
        this.referenceZonesView.resize(heightOnlyDimension);
        mainCanvasDimension = {
          height: heightOnlyDimension.height,
          width: $(document).width() - this.toolsView.$el.outerWidth() - this.detailButtonsView.$el.outerWidth()
        };
        this.mainCanvasView.resize(mainCanvasDimension);
        return this;
      };

      Maker.prototype.disableDefaultFileDrop = function() {
        $(window).on("dragover", function($evt) {
          return $evt.preventDefault();
        });
        $(window).on("dragenter", function($evt) {
          return $evt.preventDefault();
        });
        $(window).on("drop", function($evt) {
          return $evt.preventDefault();
        });
        return this;
      };

      Maker.prototype.render = function() {
        var $col1wrap, $colleft;
        this.$el.append(this.notificationsView.el);
        this.$colwrappers = $("<div class='colmask'><div class='colmid'><div class='colleft'></div></div></div>").appendTo(this.$el);
        $colleft = this.$colwrappers.find(".colleft");
        $colleft.append("<div class='col1wrap'></div>");
        $col1wrap = $colleft.find(".col1wrap");
        this.$details = $("<div/>", {
          "class": "col3 details"
        }).append(this.detailButtonsView.el).append(this.detailsView.el);
        $col1wrap.append(this.mainCanvasView.el);
        $colleft.append(this.toolsView.el).append(this.$details);
        this.resize();
        return this;
      };

      Maker.prototype.setUpProxyEvents = function() {
        this.proxyListenTo(this.toolsView, "zoomIn", this.mainCanvasView);
        this.proxyListenTo(this.toolsView, "zoomOut", this.mainCanvasView);
        this.proxyListenTo(this.toolsView, "start:panning", this.mainCanvasView);
        this.proxyListenTo(this.toolsView, "stop:panning", this.mainCanvasView);
        this.proxyListenTo(this.toolsView, "start:addingTimeline", this.mainCanvasView);
        this.proxyListenTo(this.toolsView, "stop:addingTimeline", this.mainCanvasView);
        this.proxyListenTo(this.toolsView, "start:addingRange", this.mainCanvasView);
        this.proxyListenTo(this.toolsView, "stop:addingRange", this.mainCanvasView);
        this.proxyListenTo(this.toolsView, "start:addingCurve", this.mainCanvasView);
        this.proxyListenTo(this.toolsView, "stop:addingCurve", this.mainCanvasView);
        this.proxyListenTo(this.toolsView, "show:refZones", this.mainCanvasView);
        this.proxyListenTo(this.toolsView, "hide:refZones", this.mainCanvasView);
        this.proxyListenTo(this.toolsView, "show:columnExportPreview", this.mainCanvasView);
        this.proxyListenTo(this.toolsView, "hide:columnExportPreview", this.mainCanvasView);
        this.proxyListenTo(this.toolsView, "saveToLocalJSON", this.columnManager);
        this.proxyListenTo(this, "loadFromLocalJSON", this.columnManager);
        return this;
      };

      Maker.prototype.proxyListenTo = function(fromObj, event, toObj) {
        this.listenTo(fromObj, event, function() {
          Array.prototype.unshift.call(arguments, event);
          return toObj.trigger.apply(toObj, arguments);
        });
        return this;
      };

      Maker.prototype.initReferenceZonesView = function() {
        var referenceZonesView;
        referenceZonesView = new ReferenceZonesView({
          mainCanvasView: this.mainCanvasView,
          columnManager: this.columnManager
        }).render();
        this.mainCanvasView.trigger("register:view", referenceZonesView);
        return referenceZonesView;
      };

      Maker.prototype.addExportView = function(column, columns, options) {
        var newColumnIdx, newExportView;
        newColumnIdx = columns.indexOf(column);
		// creating the export view
        newExportView = new (this.columnManager.getExportViewClazzWithColumnIndex(newColumnIdx))({
          model: this.columnManager.getColumnWithColumnIndex(newColumnIdx),
          mainCanvasView: this.mainCanvasView
        }).render();

        this.mainCanvasView.trigger("register:view", newExportView);
		this.columnManager.exportView = newExportView;
        return newExportView;
      };

      return Maker;

    })(Backbone.View);
  });

}).call(this);
