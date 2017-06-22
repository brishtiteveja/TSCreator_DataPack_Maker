(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define([], function() {
    var Timeline;
    return Timeline = (function(_super) {
      __extends(Timeline, _super);

      function Timeline() {
        this.stop = __bind(this.stop, this);
        this.start = __bind(this.start, this);
        this.updateRElPositionY = __bind(this.updateRElPositionY, this);
        this.toBack = __bind(this.toBack, this);
        this.toFront = __bind(this.toFront, this);
        this.onDragEnd = __bind(this.onDragEnd, this);
        this.onDragMove = __bind(this.onDragMove, this);
        this.onDragStart = __bind(this.onDragStart, this);
        this.onMouseOut = __bind(this.onMouseOut, this);
        this.onMouseOver = __bind(this.onMouseOver, this);
        this.unhighlight = __bind(this.unhighlight, this);
        this.highlight = __bind(this.highlight, this);
        this.render = __bind(this.render, this);
        this._insertAfterMe = __bind(this._insertAfterMe, this);
        this.cancelAction = __bind(this.cancelAction, this);
        this.deleteAction = __bind(this.deleteAction, this);
        this.editAction = __bind(this.editAction, this);
        this.inputUpdate = __bind(this.inputUpdate, this);
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

      Timeline.prototype.normalStrokeWidth = 2;

      Timeline.prototype.hoverStrokeWidth = 5;

      Timeline.prototype.events = {
        "click .edit-btn": "editAction",
        "click .timeline-detail.showing": "editAction",
        "click .delete-btn": "deleteAction",
        "click .cancel-btn": "cancelAction",
        "change input[type=text]": "inputUpdate",
        "mouseover": "onMouseOver",
        "mouseout": "onMouseOut"
      };

      Timeline.prototype.initialize = function(options) {
        this.mainCanvasView = options.mainCanvasView;
        this.initCanvasEl();
        this.listenTo(this.model, {
          "highlight": this.highlight,
          "unhighlight": this.unhighlight,
          "change:y": this.updateRElPositionY
        });
        this.listenTo(this.model, {
          "_insertAfterMe": this._insertAfterMe,
          "destroy": this.destroy
        });
        this.listenTo(this.mainCanvasView, {
          "start:addingTimeline": this.start,
          "stop:addingTimeline": this.stop
        });
        return this;
      };

      Timeline.prototype.destroy = function() {
        this.stop();
        this.rEl.remove();
        this.remove();
        return this;
      };

      Timeline.prototype.inputUpdate = function($evt) {
        var $input, key, value;
        $input = $($evt.target);
        key = $input.attr("name");
        value = $input.val();
        if (key === "age") {
          value = parseFloat(value);
          if (!isNaN(value) && isFinite(value)) {
            this.model.set(key, value);
          } else {
            this.model.unset(key);
          }
        } else {
          this.model.set(key, value);
        }
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
        this.model.destroy();
        return this;
      };

      Timeline.prototype.cancelAction = function($evt) {
        $evt.stopImmediatePropagation();
        this.isEditing = false;
        this.render();
        return this;
      };

      Timeline.prototype._insertAfterMe = function(newView) {
        this.$el.after(newView.el);
        return this;
      };

      Timeline.prototype.render = function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
      };

      Timeline.prototype.initCanvasEl = function() {
        this.rEl = this.mainCanvasView.createInfiniteHorizontalPath(this.model.get("y"));
        this.rEl.attr({
          "stroke": "#900000",
          "stroke-width": this.normalStrokeWidth
        });
        this.rEl.hover(this.onMouseOver, this.onMouseOut);
		this.renderTooltip();
        this.start();
        return this;
      };

      Timeline.prototype.highlight = function() {
        this.rEl.attr({
          "stroke-width": this.hoverStrokeWidth
        });
        return this;
      };

      Timeline.prototype.unhighlight = function() {
        this.rEl.attr({
          "stroke-width": this.normalStrokeWidth
        });
        return this;
      };

      Timeline.prototype.renderTooltip = function () {
        var age = this.model.get('age') == null ? '-' : this.model.get('age');
        $(this.rEl.node).qtip({
            content: {
                text: this.model.get('name') + "【" + age + " myr】"
            },
            position: {
                my: 'bottom left', // Position my top left...
                target: 'mouse', // my target
                adjust: {
                    x: 10,
                    y: -10
                }
            }
        });
      };

      Timeline.prototype.onMouseOver = function() {
        this.$el.addClass('hover');
        this.highlight();
        return this;
      };

      Timeline.prototype.onMouseOut = function() {
        this.$el.removeClass('hover');
        this.unhighlight();
        return this;
      };

      Timeline.prototype.onDragStart = function(x, y, evt) {
        this._aboveTimeline = this.model.getAboveTimeline();
        this._belowTimeline = this.model.getBelowTimeline();
        return this;
      };

      Timeline.prototype.onDragMove = function(dx, dy, x, y, evt) {
        var locationY, slack;
        slack = 2;
        locationY = TSCreator.utils.math.roundD4(this.mainCanvasView.getCurrentPositionFromEvt(evt).y);
        if ((this._aboveTimeline != null) && (this._belowTimeline != null) && (this._aboveTimeline.get('y') + slack > locationY || locationY > this._belowTimeline.get('y') - slack)) {
          return;
        }
        if ((this._aboveTimeline == null) && (this._belowTimeline != null) && locationY > this._belowTimeline.get('y') - slack) {
          return;
        }
        if ((this._aboveTimeline != null) && (this._belowTimeline == null) && this._aboveTimeline.get('y') + slack > locationY) {
          return;
        }
        this.model.set({
          y: locationY
        });
        return this;
      };

      Timeline.prototype.onDragEnd = function(evt) {
        delete this._aboveTimeline;
        delete this._belowTimeline;
        return this;
      };

      Timeline.prototype.toFront = function() {
        this.rEl.toFront();
        return this;
      };

      Timeline.prototype.toBack = function() {
        this.rEl.toBack();
        return this;
      };

      Timeline.prototype.updateRElPositionY = function(m, value) {
        this.rEl.attr("path")[0][2] = value;
        this.rEl.attr({
          path: this.rEl.attr("path").toString()
        });
        return this;
      };

      Timeline.prototype.start = function() {
        this.rEl.drag(this.onDragMove, this.onDragStart, this.onDragEnd);
        this.toFront();
        return this;
      };

      Timeline.prototype.stop = function() {
        this.rEl.undrag();
        return this;
      };

      return Timeline;

    })(Backbone.View);
  });

}).call(this);
