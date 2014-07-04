(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define([], function() {
    var Zone;
    return Zone = (function(_super) {
      __extends(Zone, _super);

      function Zone() {
        this.onMouseOut = __bind(this.onMouseOut, this);
        this.onMouseOver = __bind(this.onMouseOver, this);
        this.render = __bind(this.render, this);
        this._insertAfterMe = __bind(this._insertAfterMe, this);
        this.cancelAction = __bind(this.cancelAction, this);
        this.deleteAction = __bind(this.deleteAction, this);
        this.editAction = __bind(this.editAction, this);
        this.inputUpdate = __bind(this.inputUpdate, this);
        this.destroy = __bind(this.destroy, this);
        this.template = __bind(this.template, this);
        return Zone.__super__.constructor.apply(this, arguments);
      }

      Zone.prototype.tagName = "div";

      Zone.prototype.className = "data-list";

      Zone.prototype.showTemplate = new EJS({
        url: "templates/zones/show"
      });

      Zone.prototype.editTemplate = new EJS({
        url: "templates/zones/edit"
      });

      Zone.prototype.template = function() {
        var temp;
        temp = this.isEditing ? this.editTemplate : this.showTemplate;
        return temp.render.apply(temp, arguments);
      };

      Zone.prototype.isEditing = false;

      Zone.prototype.events = {
        "click .edit-btn": "editAction",
        "click .zone-detail.showing": "editAction",
        "click .cancel-btn": "cancelAction",
        "change input[type=text]": "inputUpdate",
        "change textarea": "inputUpdate",
        "mouseover": "onMouseOver",
        "mouseout": "onMouseOut"
      };

      Zone.prototype.initialize = function(options) {
        this.mainCanvasView = options.mainCanvasView;
        this.listenTo(this.model, {
          "_insertAfterMe": this._insertAfterMe,
          "destroy": this.destroy
        });
        return this;
      };

      Zone.prototype.destroy = function() {
        this.undelegateEvents();
        this.remove();
        return this;
      };

      Zone.prototype.inputUpdate = function($evt) {
        var $input, key, value;
        $input = $($evt.target);
        key = $input.attr("name");
        value = $input.val();
        this.model.set(key, value);
        return this;
      };

      Zone.prototype.editAction = function($evt) {
        $evt.stopImmediatePropagation();
        this.isEditing = true;
        this.render();
        return this;
      };

      Zone.prototype.deleteAction = function($evt) {
        $evt.stopImmediatePropagation();
        this.model.destroy;
        return this;
      };

      Zone.prototype.cancelAction = function($evt) {
        $evt.stopImmediatePropagation();
        this.isEditing = false;
        this.render();
        return this;
      };

      Zone.prototype._insertAfterMe = function(newView) {
        this.$el.after(newView.el);
        return this;
      };

      Zone.prototype.render = function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
      };

      Zone.prototype.onMouseOver = function() {
        this.$el.addClass('hover');
        this.model.get("top").trigger("highlight");
        this.model.get("base").trigger("highlight");
        return this;
      };

      Zone.prototype.onMouseOut = function() {
        this.$el.removeClass('hover');
        this.model.get("top").trigger("unhighlight");
        this.model.get("base").trigger("unhighlight");
        return this;
      };

      return Zone;

    })(Backbone.View);
  });

}).call(this);
