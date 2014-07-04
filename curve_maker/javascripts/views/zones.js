(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["./detail", "./zone"], function(Detail, ZoneView) {
    var Zones;
    return Zones = (function(_super) {
      __extends(Zones, _super);

      function Zones() {
        this.render = __bind(this.render, this);
        this.addOne = __bind(this.addOne, this);
        return Zones.__super__.constructor.apply(this, arguments);
      }

      Zones.prototype.className = "detail-panel expandable-edit";

      Zones.prototype.initialize = function(options) {
        Zones.__super__.initialize.call(this, options);
        this.zones = this.columnManager.retrieveCurrentDataModule("zones");
        this.listenTo(this.zones, "add", this.addOne);
        return this;
      };

      Zones.prototype.addOne = function(m) {
        var i, newChildView;
        newChildView = new ZoneView({
          model: m,
          mainCanvasView: this.mainCanvasView
        }).render();
        i = this.zones.indexOf(m);
        if (i === 0) {
          this.$el.prepend(newChildView.el);
        } else {
          this.zones.at(i - 1).trigger("_insertAfterMe", newChildView);
        }
        return this;
      };

      Zones.prototype.render = function() {
        _.each(this.zones, this.addOne);
        return this;
      };

      return Zones;

    })(Detail);
  });

}).call(this);
