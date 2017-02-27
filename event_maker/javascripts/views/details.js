(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["../models/detail", "../models/details", "./detail"], function(DetailModel, DetailCollection, DetailView) {
    var Details;
    return Details = (function(_super) {
      __extends(Details, _super);

      function Details() {
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
        this.columnManager = options.columnManager;
        this.toolsView = options.toolsView;
        this.collection.add(this.columnManager.getAllModulesForCurrentColumn());
        return this;
      };

      Details.prototype.addOne = function(m) {
        var clazz, newDetailPanelView;
        newDetailPanelView = m.get("viewClazz") != null ? (clazz = m.get("viewClazz"), new clazz({
          model: m,
          mainCanvasView: this.mainCanvasView,
          columnManager: this.columnManager
        }).render()) : new DetailView({
          model: m,
          mainCanvasView: this.mainCanvasView,
          columnManager: this.columnManager,
          toolsView: this.toolsView
        }).render();
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

      return Details;

    })(Backbone.View);
  });

}).call(this);
