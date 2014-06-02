(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["./views/main_panel", "./views/tools", "./models/details", "./views/detail_buttons", "./views/details"], function(MainPanelView, ToolsView, DetailCollection, DetailButtonsView, DetailsView) {
    var CurveMaker;
    return CurveMaker = (function(_super) {
      __extends(CurveMaker, _super);

      function CurveMaker() {
        this.render = __bind(this.render, this);
        this.resizer = __bind(this.resizer, this);
        return CurveMaker.__super__.constructor.apply(this, arguments);
      }

      CurveMaker.prototype.initialize = function(options) {
        this.mainPanelView = new MainPanelView({
          className: "col1 disable-user-select"
        }).render();
        this.toolsView = new ToolsView({
          className: "col2 toolbar"
        }).render();
        this.detailList = new DetailCollection();
        this.detailButtonsView = new DetailButtonsView({
          className: "detail-buttons",
          detailList: this.detailList
        }).render();
        this.detailsView = new DetailsView({
          className: "detail-panels",
          detailList: this.detailList
        }).render();
        $(window).resize(this.resizer);
        return this;
      };

      CurveMaker.prototype.resizer = function() {
        this._resizerHelper({
          height: $(window).height()
        });
        return this;
      };

      CurveMaker.prototype._resizerHelper = _.debounce(function(dimension) {
        this.mainPanelView.$el.css(dimension);
        this.toolsView.$el.css(dimension);
        return this.$details.css(dimension);
      }, 300);

      CurveMaker.prototype.render = function() {
        var $col1wrap, $colleft;
        this.$colwrappers = $("<div class='colmask'><div class='colmid'><div class='colleft'></div></div></div>").appendTo(this.$el);
        $colleft = this.$colwrappers.find(".colleft");
        $colleft.append("<div class='col1wrap'></div>");
        $col1wrap = $colleft.find(".col1wrap");
        this.$details = $("<div/>", {
          "class": "col3 details"
        }).append(this.detailButtonsView.el).append(this.detailsView.el);
        $col1wrap.append(this.mainPanelView.el);
        $colleft.append(this.toolsView.el).append(this.$details);
        this.resizer();
        return this;
      };

      return CurveMaker;

    })(Backbone.View);
  });

}).call(this);
