(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["../models/detail"], function(DetailModel) {
    var DetailButton;
    return DetailButton = (function(_super) {
      __extends(DetailButton, _super);

      function DetailButton() {
        this.render = __bind(this.render, this);
        this.changeClassName = __bind(this.changeClassName, this);
        this.toggleDetail = __bind(this.toggleDetail, this);
        return DetailButton.__super__.constructor.apply(this, arguments);
      }

      DetailButton.prototype.tagName = "div";

      DetailButton.prototype.className = "detail-button";

      DetailButton.prototype.events = {
        "click": "toggleDetail"
      };

      DetailButton.prototype.initialize = function() {
        this.listenTo(this.model, "change:isActivated", this.changeClassName);
        return this;
      };

      DetailButton.prototype.toggleDetail = function($evt) {
        $evt.preventDefault();
        this.model.collection.trigger("toggleDetail", this.model);
        return this;
      };

      DetailButton.prototype.changeClassName = function() {
        if (this.model.get("isActivated") && !this.$el.hasClass("selected")) {
          this.$el.addClass("selected");
        } else {
          this.$el.removeClass("selected");
        }
        return this;
      };

      DetailButton.prototype.render = function() {
        this.$link = $("<span/>", {
          "class": "detail-button-settings-icon icon",
          title: this.model.get("title")
        }).addClass(this.model.get("name"));
        this.$text = $("<span/>", {
          "class": "detail-button-text"
        }).text(this.model.get("text"));
        this.$el.append(this.$link).append(this.$text);
        return this;
      };

      return DetailButton;

    })(Backbone.View);
  });

}).call(this);
