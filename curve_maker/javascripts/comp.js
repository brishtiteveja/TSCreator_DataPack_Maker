(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["./views/tools", "./models/details", "./views/detail_buttons", "./views/details"], function(ToolsView, DetailCollection, DetailButtonsView, DetailsView) {
    var CurveMaker;
    return CurveMaker = (function(_super) {
      __extends(CurveMaker, _super);

      function CurveMaker() {
        this.render = __bind(this.render, this);
        return CurveMaker.__super__.constructor.apply(this, arguments);
      }

      CurveMaker.prototype.initialize = function(options) {
        this.toolsView = new ToolsView({
          className: "toolbar"
        }).render();
        this.$mainPanel = $("<main/>", {
          className: "display"
        });
        this.detailList = new DetailCollection();
        this.detailButtonsView = new DetailButtonsView({
          className: "detail-buttons",
          detailList: this.detailList
        }).render();
        this.detailsView = new DetailsView({
          className: "detail-panels",
          detailList: this.detailList
        }).render();
        return this;
      };

      CurveMaker.prototype.render = function() {
        this.$details = $("<div/>", {
          "class": "details"
        }).append(this.detailButtonsView.el).append(this.detailsView.el);
        this.$el.append(this.toolsView.el).append(this.$mainPanel).append(this.$details);
        return this;
      };

      return CurveMaker;

    })(Backbone.View);
  });

}).call(this);
