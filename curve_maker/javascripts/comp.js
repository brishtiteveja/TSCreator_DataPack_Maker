(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["./views/notifications", "./views/main_canvas", "./views/tools", "./views/detail_buttons", "./views/details"], function(NotificationsView, MainCanvasView, ToolsView, DetailButtonsView, DetailsView, TimelineCollection, ZoneCollection) {
    var CurveMaker;
    return CurveMaker = (function(_super) {
      __extends(CurveMaker, _super);

      function CurveMaker() {
        this.proxyListenTo = __bind(this.proxyListenTo, this);
        this.render = __bind(this.render, this);
        this.disableDefaultFileDrop = __bind(this.disableDefaultFileDrop, this);
        this.resize = __bind(this.resize, this);
        return CurveMaker.__super__.constructor.apply(this, arguments);
      }

      CurveMaker.prototype.initialize = function(options) {
        var debouncedResize;
        this.columnManager = options.columnManager;
        this.notificationsView = new NotificationsView({
          className: "notifications"
        }).render();
        this.proxyListenTo(this, "showInfo", this.notificationsView);
        this.mainCanvasView = new MainCanvasView({
          className: "col1 disable-user-select",
          masterView: this
        }).render();
        this.toolsView = new ToolsView({
          className: "col2 toolbar"
        }).render();
        this.setUpProxyEventsFromTools();
        this.listenTo(this.toolsView, "all", function(event) {
          if (event !== "selectTool" && event !== "change" && event !== "change:isActivated") {
            return console.log(event);
          }
        });
        this.detailsView = new DetailsView({
          className: "detail-panels",
          mainCanvasView: this.mainCanvasView,
          columnManager: this.columnManager
        }).render();
        this.detailButtonsView = new DetailButtonsView({
          className: "detail-buttons",
          collection: this.detailsView.collection
        }).render();
        debouncedResize = _.debounce(this.resize, 150);
        $(window).resize(debouncedResize);
        this.disableDefaultFileDrop();
        return this;
      };

      CurveMaker.prototype.resize = function() {
        var heightOnlyDimension, mainCanvasDimension;
        heightOnlyDimension = {
          height: $(window).height()
        };
        this.toolsView.resize(heightOnlyDimension);
        this.detailButtonsView.resize(heightOnlyDimension);
        this.detailsView.resize(heightOnlyDimension);
        mainCanvasDimension = {
          height: heightOnlyDimension.height,
          width: $(document).width() - this.toolsView.$el.outerWidth() - this.detailButtonsView.$el.outerWidth()
        };
        this.mainCanvasView.resize(mainCanvasDimension);
        return this;
      };

      CurveMaker.prototype.disableDefaultFileDrop = function() {
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

      CurveMaker.prototype.render = function() {
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

      CurveMaker.prototype.setUpProxyEventsFromTools = function() {
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
        return this;
      };

      CurveMaker.prototype.proxyListenTo = function(fromObj, event, toObj) {
        this.listenTo(fromObj, event, function() {
          Array.prototype.unshift.call(arguments, event);
          return toObj.trigger.apply(toObj, arguments);
        });
        return this;
      };

      return CurveMaker;

    })(Backbone.View);
  });

}).call(this);
