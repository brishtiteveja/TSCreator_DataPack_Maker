(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["./detail"], function(Detail) {
    var Details;
    return Details = (function(_super) {
      __extends(Details, _super);

      function Details() {
        this.toggleDetail = __bind(this.toggleDetail, this);
        return Details.__super__.constructor.apply(this, arguments);
      }

      Details.prototype.model = Detail;

      Details.prototype.activatedDetailModel = null;

      Details.prototype.initialize = function() {
        this.listenTo(this, "toggleDetail", this.toggleDetail);
        return this;
      };

      Details.prototype.toggleDetail = function(m) {
          if (this.activatedDetailModel != null && this.activatedDetailModel === m)    {
                m.deactivate();
                this.activatedDetailModel = null;
          } else {
                if (this.activatedDetailModel != null) {
                    this.activatedDetailModel.deactivate();
                }
                m.activate();
                this.activatedDetailModel = m;
          }
        return this;
      };

      return Details;

    })(Backbone.Collection);
  });

}).call(this);
