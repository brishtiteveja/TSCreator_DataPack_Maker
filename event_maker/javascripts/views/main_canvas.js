(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define([], function() {
    var INF, MainCanvas, SMALLINF;
    INF = 500000;
    SMALLINF = 10000;
    return MainCanvas = (function(_super) {
      __extends(MainCanvas, _super);

      function MainCanvas() {
        this.zoomUpdate = __bind(this.zoomUpdate, this);
        this.zoomOut = __bind(this.zoomOut, this);
        this.zoomIn = __bind(this.zoomIn, this);
        this.stopPanning = __bind(this.stopPanning, this);
        this.startPanning = __bind(this.startPanning, this);
        this.onPanningEnd = __bind(this.onPanningEnd, this);
        this.onPanningMove = __bind(this.onPanningMove, this);
        this.onPanningStart = __bind(this.onPanningStart, this);
        this.getCurrentPositionFromEvt = __bind(this.getCurrentPositionFromEvt, this);
        this.getCurrentPositionFromOffset = __bind(this.getCurrentPositionFromOffset, this);
        this.createImage = __bind(this.createImage, this);
        this.createText = __bind(this.createText, this);
        this.createCircle = __bind(this.createCircle, this);
        this.createInfiniteVerticalPath = __bind(this.createInfiniteVerticalPath, this);
        this.createInfiniteHorizontalPath = __bind(this.createInfiniteHorizontalPath, this);
        this.createStraightLine = __bind(this.createStraightLine, this);
        this.createPath = __bind(this.createPath, this);
        this.createInfiniteOverlay = __bind(this.createInfiniteOverlay, this);
        this.createRect = __bind(this.createRect, this);
        this.createSet = __bind(this.createSet, this);
        this.render = __bind(this.render, this);
        this.resize = __bind(this.resize, this);
        this.registerSubView = __bind(this.registerSubView, this);
        this.startAndLoadDatafile = __bind(this.startAndLoadDatafile, this);
        this.readJSONFile = __bind(this.readJSONFile, this);
        this.loadDatafile = __bind(this.loadDatafile, this);
        this.showPaper = __bind(this.showPaper, this);
        return MainCanvas.__super__.constructor.apply(this, arguments);
      }

      MainCanvas.prototype.tagName = "main";

      MainCanvas.prototype.introTemplate = new EJS({
        url: "templates/intro"
      });

      MainCanvas.prototype.events = {
        "drop .data-dropbox": "startAndLoadDatafile",
        "click .continue": "showPaper"
      };

      MainCanvas.prototype.initialize = function(options) {
        this.columnManager = options.columnManager;
        this.drawRangeAtStart = options.drawRangeAtStart;
        this.masterView = options.masterView;
        this.curDimension = null;
        this.curViewBox = {
          x: 0,
          y: 0
        };
        this.$intro = $(this.introTemplate.render());
        this.listenTo(this, "register:view", this.registerSubView);
        this.rPaper = Raphael(this.el, "100%", "100%");
        this.initPan();
        this.initZoom();
        return this;
      };

      MainCanvas.prototype.showPaper = function() {
        this.$intro.hide();
        $(this.rPaper.canvas).show();
        this.columnManager.trigger("triggerEventsToMasterView", ["start:addingRange"])

        return this;
      };

      MainCanvas.prototype.loadDatafile = function($evt) {
        var jsonFile, reader;
        $evt.preventDefault();
        $evt.stopPropagation();
        $evt.originalEvent.dataTransfer.files.length !== 1;
        jsonFile = $evt.originalEvent.dataTransfer.files[0];
        reader = new FileReader();
        reader.onload = this.readJSONFile;
        reader.readAsText(jsonFile);
        return this;
      };

      MainCanvas.prototype.readJSONFile = function(evt) {
        var jsonStr;
        jsonStr = evt.target.result;
        this.masterView.trigger("loadFromLocalJSON", JSON.parse(jsonStr));
        return this;
      };

      MainCanvas.prototype.startAndLoadDatafile = function($evt) {
        this.showPaper();
        this.loadDatafile($evt);
        return this;
      };

      MainCanvas.prototype.registerSubView = function(subView) {
        this.$el.append(subView.el);
        return this;
      };

      MainCanvas.prototype.resize = function(dimension) {
        this.curDimension = dimension;
        this.$el.css({
          height: this.curDimension.height
        });
        this.rPaper.setViewBox(this.curViewBox.x, this.curViewBox.y, this.curDimension.width * this.zoomMultiplier, this.curDimension.height * this.zoomMultiplier);
        return this;
      };

      MainCanvas.prototype.render = function() {
        $(this.rPaper.canvas).hide();
        this.$el.append(this.$intro);
        return this;
      };

      MainCanvas.prototype.createSet = function() {
        return this.rPaper.set.apply(this.rPaper, arguments);
      };

      MainCanvas.prototype.createRect = function() {
        return this.rPaper.rect.apply(this.rPaper, arguments);
      };

      MainCanvas.prototype.createInfiniteOverlay = function() {
        var newOverlay;
        newOverlay = this.rPaper.rect(-INF, -INF, 2 * INF, 2 * INF);
        newOverlay.attr({
          "fill": "#FFFFFF",
          "fill-opacity": 0,
          "stroke-width": 0
        });
        return newOverlay;
      };

      MainCanvas.prototype.createPath = function() {
        return this.rPaper.path.apply(this.rPaper, arguments);
      };

      MainCanvas.prototype.createStraightLine = function() {
        if (arguments.length === 4) {
          return this.createPath("M" + arguments[0] + "," + arguments[1] + "L" + arguments[2] + "," + arguments[3]);
        } else if (arguments.length === 2) {
          return this.createPath("M" + arguments[0].x + "," + arguments[0].y + "L" + arguments[1].x + "," + arguments[1].y);
        }
      };

      MainCanvas.prototype.createInfiniteHorizontalPath = function(y) {
        var newPath;
        newPath = this.createPath("M" + (-SMALLINF) + "," + y + "H" + SMALLINF);
        newPath.attr({
          "fill": "#FFFFFF",
          "fill-opacity": 0
        });
        return newPath;
      };

      MainCanvas.prototype.createInfiniteVerticalPath = function(x) {
        var newPath;
        newPath = this.rPaper.path("M" + x + "," + (-SMALLINF) + "V" + SMALLINF);
        newPath.attr({
          "fill": "#FFFFFF",
          "fill-opacity": 0
        });
        return newPath;
      };

      MainCanvas.prototype.createCircle = function() {
        return this.rPaper.circle.apply(this.rPaper, arguments);
      };
      
      MainCanvas.prototype.createArrow = function() {
        return this.rPaper.path({fill:"#ff0000" ,stroke:"#0000ff" , "stroke-width":"3"}, "M 150,200 L 150,250 L 175,225 z");
      };

      MainCanvas.prototype.createText = function() {
        return this.rPaper.text.apply(this.rPaper, arguments);
      };

      MainCanvas.prototype.createImage = function() {
        return this.rPaper.image.apply(this.rPaper, arguments);
      };

      MainCanvas.prototype.getCurrentPositionFromOffset = function(dx, dy) {
        return {
          x: this.curViewBox.x + (dx * this.zoomMultiplier),
          y: this.curViewBox.y + (dy * this.zoomMultiplier)
        };
      };

      MainCanvas.prototype.getCurrentPositionFromEvt = function(evt) {
        var dx, dy;
        if ((evt.offsetX != null) && evt.offsetY) {
          dx = evt.offsetX;
          dy = evt.offsetY;
        } else {
          dx = evt.layerX;
          dy = evt.layerY;
        }
        return this.getCurrentPositionFromOffset(dx, dy);
      };

      MainCanvas.prototype.initPan = function() {
        this.panOverlay = this.createInfiniteOverlay();
        this.stopPanning();
        this.trigger("viewBoxChanged", this.curViewBox);
        this.listenTo(this, "start:panning", this.startPanning);
        this.listenTo(this, "stop:panning", this.stopPanning);
        return this;
      };

      MainCanvas.prototype.onPanningStart = function(x, y, evt) {
        return this;
      };

      MainCanvas.prototype.onPanningMove = function(dx, dy, x, y, evt) {
        var newX, newY;
        newX = this.curViewBox.x - (dx * this.zoomMultiplier);
        newY = this.curViewBox.y - (dy * this.zoomMultiplier);
        this.rPaper.setViewBox(newX, newY, this.curDimension.width * this.zoomMultiplier, this.curDimension.height * this.zoomMultiplier);
        this.trigger("viewBoxChanged", {
          x: newX,
          y: newY
        });
        return this;
      };

      MainCanvas.prototype.onPanningEnd = function(evt) {
        var viewBox;
        viewBox = this.rPaper.canvas.viewBox.baseVal;
        this.curViewBox = {
          x: viewBox.x,
          y: viewBox.y
        };
        this.trigger("viewBoxChanged", this.curViewBox);
        return this;
      };

      MainCanvas.prototype.startPanning = function() {
        this.panOverlay.drag(this.onPanningMove, this.onPanningStart, this.onPanningEnd);
        this.panOverlay.toFront();
        this.$el.addClass("cursor-panning");
        return this;
      };

      MainCanvas.prototype.stopPanning = function() {
        this.panOverlay.toBack();
        this.panOverlay.undrag();
        this.$el.removeClass("cursor-panning");
        return this;
      };

      MainCanvas.prototype.initZoom = function() {
        this.defaultZoom = 5;
        this.zoom = this.defaultZoom;
        this.zoomMultiplier = this.defaultZoom / this.zoom;
        this.trigger("zoomMultiplierChanged", this.zoomMultiplier);
        this.listenTo(this, "zoomIn", this.zoomIn);
        this.listenTo(this, "zoomOut", this.zoomOut);
        return this;
      };

      MainCanvas.prototype.zoomIn = function() {
        if (this.zoom < 25) {
          this.zoom += 1;
          this.zoomMultiplier = this.defaultZoom / this.zoom;
          this.zoomUpdate();
        } else {
          this.masterView.trigger("showInfo", "You cannot zoom-in anymore.", 50);
        }
        return this;
      };

      MainCanvas.prototype.zoomOut = function() {
        if (this.zoom > 1) {
          this.zoom -= 1;
          this.zoomMultiplier = this.defaultZoom / this.zoom;
          this.zoomUpdate();
        } else {
          this.masterView.trigger("showInfo", "You cannot zoom-out anymore.", 50);
        }
        return this;
      };

      MainCanvas.prototype.zoomUpdate = function() {
        this.rPaper.setViewBox(this.curViewBox.x, this.curViewBox.y, this.curDimension.width * this.zoomMultiplier, this.curDimension.height * this.zoomMultiplier);
        this.masterView.trigger("showInfo", "Zoom: " + (Math.round((1 / this.zoomMultiplier) * 100)) + "%", 50);
        this.trigger("zoomMultiplierChanged", this.zoomMultiplier);
        return this;
      };

      return MainCanvas;

    })(Backbone.View);
  });

}).call(this);
