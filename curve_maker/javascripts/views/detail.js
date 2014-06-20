(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["../models/detail"], function(DetailModel) {
    var Detail;
    return Detail = (function(_super) {
      __extends(Detail, _super);

      function Detail() {
        this.render = __bind(this.render, this);
        this.togglePanel = __bind(this.togglePanel, this);
        return Detail.__super__.constructor.apply(this, arguments);
      }

      Detail.prototype.tagName = "div";

      Detail.prototype.className = "detail-panel";

      Detail.prototype.initialize = function(options) {
        this.mainCanvasView = options.mainCanvasView;
        this.listenTo(this.model, "change:isActivated", this.togglePanel);
        this.template = this.model.get("template") || new EJS({
          text: "<div>Coming soon... (<%= text %>)</div>"
        });
        this.togglePanel();
        return this;
      };

      Detail.prototype.togglePanel = function() {
        if (this.model.get("isActivated")) {
          this.$el.css("display", "inline-block");
        } else {
          this.$el.hide();
        }
        return this;
      };

      Detail.prototype.render = function() {
        this.$el.html(this.template.render(this.model.toJSON()));
        return this;
      };

      return Detail;

    })(Backbone.View);
  });

}).call(this);
