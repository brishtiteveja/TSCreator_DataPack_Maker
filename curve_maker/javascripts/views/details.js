(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["../models/detail", "../models/details", "./detail"], function(DetailModel, DetailCollection, DetailView) {
    var Details;
    return Details = (function(_super) {
      __extends(Details, _super);

      function Details() {
        this.addOne = __bind(this.addOne, this);
        return Details.__super__.constructor.apply(this, arguments);
      }

      Details.prototype.tagName = "div";

      Details.prototype.initialize = function(options) {
        this.detailList = new DetailCollection();
        this.detailList.on("add", this.addOne);
        return this;
      };

      Details.prototype.addOne = function(m) {
        var newDetailView;
        newDetailView = new DetailView;
        return this;
      };

      return Details;

    })(Backbone.View);
  });

}).call(this);
