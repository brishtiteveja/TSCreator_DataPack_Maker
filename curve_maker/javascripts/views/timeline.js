(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define([], function() {
    var Timeline;
    return Timeline = (function(_super) {
      __extends(Timeline, _super);

      function Timeline() {
        this.render = __bind(this.render, this);
        return Timeline.__super__.constructor.apply(this, arguments);
      }

      Timeline.prototype.tagName = "div";

      Timeline.prototype.className = "data-list";

      Timeline.prototype.template = new EJS({
        url: "templates/timeline"
      });

      Timeline.prototype.editTemplate = new EJS({
        url: "templates/timeline_edit"
      });

      Timeline.prototype.initialize = function(options) {
        this.mainCanvasView = options.mainCanvasView;
        return this;
      };

      Timeline.prototype.render = function() {
        this.$el.append(this.template.render(this.model.toJSON()));
        return this;
      };

      return Timeline;

    })(Backbone.View);
  });

}).call(this);
