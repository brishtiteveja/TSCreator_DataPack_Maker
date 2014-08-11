(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define([], function() {
    var ReferencesDetail;
    return ReferencesDetail = (function(_super) {
      __extends(ReferencesDetail, _super);

      function ReferencesDetail() {
        return ReferencesDetail.__super__.constructor.apply(this, arguments);
      }

      ReferencesDetail.prototype.defaults = {
        topAge: 0,
        baseAge: 15,
        gapSize: 50,
        offsetY: 0
      };

      return ReferencesDetail;

    })(Backbone.Model);
  });

}).call(this);
