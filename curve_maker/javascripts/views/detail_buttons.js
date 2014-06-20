(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["../models/detail", "../models/details", "./detail_button"], function(DetailModel, DetailCollection, DetailButtonView) {
    var DetailButtons;
    return DetailButtons = (function(_super) {
      __extends(DetailButtons, _super);

      function DetailButtons() {
        this.render = __bind(this.render, this);
        this.resize = __bind(this.resize, this);
        this.forceToRedraw = __bind(this.forceToRedraw, this);
        this.addOne = __bind(this.addOne, this);
        return DetailButtons.__super__.constructor.apply(this, arguments);
      }

      DetailButtons.prototype.tagName = "div";

      DetailButtons.prototype.events = {
        "mouseleave": "forceToRedraw"
      };

      DetailButtons.prototype.initialize = function(options) {
        this.listenTo(this.collection, "add", this.addOne);
        return this;
      };

      DetailButtons.prototype.addOne = function(m) {
        var newDetailButtonView;
        newDetailButtonView = new DetailButtonView({
          model: m
        }).render();
        m.detailButtonView = newDetailButtonView;
        this.$el.append(newDetailButtonView.el);
        return this;
      };

      DetailButtons.prototype.forceToRedraw = function($evt) {
        this.$el.hide().show(0);
        return this;
      };

      DetailButtons.prototype.resize = function(dimension) {
        this.$el.css(dimension);
        return this;
      };

      DetailButtons.prototype.render = function() {
        this.collection.each(this.addOne);
        return this;
      };

      return DetailButtons;

    })(Backbone.View);
  });

}).call(this);
