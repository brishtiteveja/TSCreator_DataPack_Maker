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
        this.toBack = __bind(this.toBack, this);
        this.toFront = __bind(this.toFront, this);
        this.cancelAction = __bind(this.cancelAction, this);
        this.deleteAction = __bind(this.deleteAction, this);
        this.editAction = __bind(this.editAction, this);
        this.update = __bind(this.update, this);
        this.destroy = __bind(this.destroy, this);
        this.template = __bind(this.template, this);
        return Timeline.__super__.constructor.apply(this, arguments);
      }

      Timeline.prototype.tagName = "div";

      Timeline.prototype.className = "data-list";

      Timeline.prototype.showTemplate = new EJS({
        url: "templates/timelines/show"
      });

      Timeline.prototype.editTemplate = new EJS({
        url: "templates/timelines/edit"
      });

      Timeline.prototype.template = function() {
        var temp;
        temp = this.isEditing ? this.editTemplate : this.showTemplate;
        return temp.render.apply(temp, arguments);
      };

      Timeline.prototype.isEditing = false;

      Timeline.prototype.events = {
        "click .edit-btn": "editAction",
        "click .timeline-detail": "editAction",
        "click .delete-btn": "deleteAction",
        "click .cancel-btn": "cancelAction",
        "change input[type='text']": "update"
      };

      Timeline.prototype.initialize = function(options) {
        this.mainCanvasView = options.mainCanvasView;
        this.rLine = this.mainCanvasView.createInfiniteHorizontalPathWithY(this.model.get("y"));
        this.rLine.node.setAttribute("class", "timeline");
        this.listenTo(this.model, "toFront", this.toFront);
        this.listenTo(this.model, "toBack", this.toBack);
        return this;
      };

      Timeline.prototype.destroy = function() {
        this.undelegateEvents();
        this.remove();
        this.model = null;
        return this;
      };

      Timeline.prototype.update = function($evt) {
        var $input, key, value;
        $input = $($evt.target);
        key = $input.attr("name");
        value = $input.val();
        this.model.set(key, value);
        return this;
      };

      Timeline.prototype.editAction = function($evt) {
        $evt.stopImmediatePropagation();
        this.isEditing = true;
        this.render();
        return this;
      };

      Timeline.prototype.deleteAction = function($evt) {
        $evt.stopImmediatePropagation();
        this.model.destroy({
          wait: true
        });
        this.destroy();
        return this;
      };

      Timeline.prototype.cancelAction = function($evt) {
        $evt.stopImmediatePropagation();
        this.isEditing = false;
        this.render();
        return this;
      };

      Timeline.prototype.toFront = function() {
        this.rLine.toFront();
        return this;
      };

      Timeline.prototype.toBack = function() {
        this.rLine.toBack();
        return this;
      };

      Timeline.prototype.render = function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
      };

      return Timeline;

    })(Backbone.View);
  });

}).call(this);
