(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define([], function() {
    var Option;
    return Option = (function(_super) {
      __extends(Option, _super);

      function Option() {
        return Option.__super__.constructor.apply(this, arguments);
      }

      return Option;

    })(Backbone.Model);
  });

}).call(this);
