(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["../models/detail", "../models/details", "./detail", "./timelines", "./image_detail"], function(DetailModel, DetailCollection, DetailView, TimelinesView, ImageDetailView) {
    var Details;
    return Details = (function(_super) {
      __extends(Details, _super);

      function Details() {
        this.render = __bind(this.render, this);
        this.resize = __bind(this.resize, this);
        this.activateDetail = __bind(this.activateDetail, this);
        this.addOne = __bind(this.addOne, this);
        return Details.__super__.constructor.apply(this, arguments);
      }

      Details.prototype.tagName = "div";

      Details.prototype.initialize = function(options) {
        this.collection = new DetailCollection();
        this.listenTo(this.collection, "add", this.addOne);
        this.mainCanvasView = options.mainCanvasView;
        return this;
      };

      Details.prototype.addOne = function(m) {
        var clazz, newDetailPanelView;
        newDetailPanelView = m.get("clazz") != null ? (clazz = m.get("clazz"), new clazz({
          model: m,
          mainCanvasView: this.mainCanvasView
        }).render()) : new DetailView({
          model: m,
          mainCanvasView: this.mainCanvasView
        }).render();
        m.detailPanelView = newDetailPanelView;
        this.$el.append(newDetailPanelView.el);
        return this;
      };

      Details.prototype.activateDetail = function() {
        return this;
      };

      Details.prototype.resize = function(dimension) {
        this.$el.css(dimension);
        return this;
      };

      Details.prototype.render = function() {
        this.collection.add({
          name: "timeLinesDetail",
          text: "Time Lines",
          title: "Show time line details",
          clazz: TimelinesView
        });
        this.collection.add({
          name: "zonesDetail",
          text: "Zones",
          title: "Show zone details"
        });
        this.collection.add({
          name: "rangeDetail",
          text: "Range",
          title: "Show range limit details"
        });
        this.collection.add({
          name: "curvesDetail",
          text: "Curves",
          title: "Show curve details"
        });
        this.collection.add({
          name: "imagesDetail",
          text: "Image",
          title: "Set up background image",
          template: new EJS({
            url: "templates/images_detail"
          }),
          clazz: ImageDetailView
        });
        this.collection.add({
          name: "referenceColumnsDetail",
          text: "References",
          title: "Set reference columns"
        });
        this.collection.add({
          name: "defaultsDetail",
          text: "Defaults",
          title: "Defaults..."
        });
        return this;
      };

      return Details;

    })(Backbone.View);
  });

}).call(this);
