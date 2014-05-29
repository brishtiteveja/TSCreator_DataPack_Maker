(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["../models/detail"], function(DetailModel) {
    var Detail;
    return Detail = (function(_super) {
      __extends(Detail, _super);

      function Detail() {
        return Detail.__super__.constructor.apply(this, arguments);
      }

      Detail.prototype.tagName = "div";

      return Detail;

    })(Backbone.View);
  });

}).call(this);
