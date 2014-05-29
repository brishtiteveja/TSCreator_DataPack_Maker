(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["./views/tools", "./views/details"], function(ToolsView, DetailsView) {
    var CurveMaker;
    return CurveMaker = (function(_super) {
      __extends(CurveMaker, _super);

      function CurveMaker() {
        this.render = __bind(this.render, this);
        return CurveMaker.__super__.constructor.apply(this, arguments);
      }

      CurveMaker.prototype.initialize = function(options) {
        this.toolsView = new ToolsView({
          id: "toolbar"
        }).render();
        this.$mainPanel = $("<main/>", {
          id: "display",
          "class": "small-18 large-21 columns linked"
        });
        this.detailsView = new DetailsView({
          id: "details"
        }).render();
        return this;
      };

      CurveMaker.prototype.render = function() {
        this.$el.append(this.toolsView.el).append(this.$mainPanel).append(this.detailsView.el);
        return this;
      };

      return CurveMaker;

    })(Backbone.View);
  });

}).call(this);
