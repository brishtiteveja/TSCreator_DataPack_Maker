(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["../models/detail", "../models/details", "./detail"], function(DetailModel, DetailCollection, DetailView) {
    var Details;
    return Details = (function(_super) {
      __extends(Details, _super);

      function Details() {
        this.render = __bind(this.render, this);
        this.activateDetail = __bind(this.activateDetail, this);
        this.addOne = __bind(this.addOne, this);
        return Details.__super__.constructor.apply(this, arguments);
      }

      Details.prototype.tagName = "div";

      Details.prototype.initialize = function(options) {
        this.detailList = options.detailList;
        this.detailList.on("add", this.addOne);
        return this;
      };

      Details.prototype.addOne = function(m) {
        var newDetailPanelView;
        newDetailPanelView = new DetailView({
          model: m
        }).render();
        m.detailPanelView = newDetailPanelView;
        this.$el.append(newDetailPanelView.el);
        return this;
      };

      Details.prototype.activateDetail = function() {
        return this;
      };

      Details.prototype.render = function() {
        this.detailList.add({
          name: "detail-button-time-lines",
          text: "Time Lines",
          title: "Show time line details"
        });
        this.detailList.add({
          name: "detail-button-zones",
          text: "Zones",
          title: "Show zone details"
        });
        this.detailList.add({
          name: "detail-button-range-lines",
          text: "Ranges",
          title: "Show range line details"
        });
        this.detailList.add({
          name: "detail-button-background-image",
          text: "Image",
          title: "Set up background image"
        });
        this.detailList.add({
          name: "detail-button-reference-columns",
          text: "References",
          title: "Set reference columns"
        });
        this.detailList.add({
          name: "detail-button-default",
          text: "Default",
          title: "Default..."
        });
        return this;
      };

      return Details;

    })(Backbone.View);
  });

}).call(this);
