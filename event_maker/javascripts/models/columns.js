(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["./column"], function(Column) {
    var Columns;
    return Columns = (function(_super) {
      __extends(Columns, _super);

      function Columns() {
        return Columns.__super__.constructor.apply(this, arguments);
      }

      Columns.prototype.model = Column;

      return Columns;

    })(Backbone.Collection);
  });

}).call(this);
