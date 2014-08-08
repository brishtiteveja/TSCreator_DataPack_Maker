(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["./detail"], function(Detail) {
    var ReferencesDetail;
    return ReferencesDetail = (function(_super) {
      __extends(ReferencesDetail, _super);

      function ReferencesDetail() {
        this.onTextInputChanged = __bind(this.onTextInputChanged, this);
        this.updateOffsetYInput = __bind(this.updateOffsetYInput, this);
        this.updateGapSizeInput = __bind(this.updateGapSizeInput, this);
        this.updateBaseAgeInput = __bind(this.updateBaseAgeInput, this);
        this.updateTopAgeInput = __bind(this.updateTopAgeInput, this);
        this.render = __bind(this.render, this);
        return ReferencesDetail.__super__.constructor.apply(this, arguments);
      }

      ReferencesDetail.prototype.events = {
        "change input[type=text]": "onTextInputChanged",
        "change input[name=ref-column]": "onRefColumnChanged"
      };

      ReferencesDetail.prototype.initialize = function(options) {
        ReferencesDetail.__super__.initialize.call(this, options);
        this.referenceColumns = this.columnManager.retrieveCommonData("referenceColumns");
        this.listenTo(this.referenceColumns, {
          "change:topAge": this.updateTopAgeInput,
          "change:baseAge": this.updateBaseAgeInput,
          "change:gapSize": this.updateGapSizeInput,
          "change:offsetY": this.updateOffsetYInput
        });
        return this;
      };

      ReferencesDetail.prototype.render = function() {
        this.$el.html(this.template.render(this.referenceColumns.toJSON()));
        return this;
      };

      ReferencesDetail.prototype.updateTopAgeInput = function(m, value) {
        var $input;
        $input = this.$el.find("input[name=topAge]");
        if (parseFloat($input.val()) !== value) {
          $input.val(value);
        }
        return this;
      };

      ReferencesDetail.prototype.updateBaseAgeInput = function(m, value) {
        var $input;
        $input = this.$el.find("input[name=baseAge]");
        if (parseFloat($input.val()) !== value) {
          $input.val(value);
        }
        return this;
      };

      ReferencesDetail.prototype.updateGapSizeInput = function(m, value) {
        var $input;
        $input = this.$el.find("input[name=gapSize]");
        if (parseFloat($input.val()) !== value) {
          $input.val(value);
        }
        return this;
      };

      ReferencesDetail.prototype.updateOffsetYInput = function(m, value) {
        var $input;
        $input = this.$el.find("input[name=offsetY]");
        if (parseFloat($input.val()) !== value) {
          $input.val(value);
        }
        return this;
      };

      ReferencesDetail.prototype.onTextInputChanged = function($evt) {
        var $input, key, value;
        $input = $($evt.target);
        key = $input.attr("name");
        value = $input.val();
        value = parseFloat(value);
        if (!isNaN(value) && isFinite(value)) {
          this.referenceColumns.set(key, value);
        } else {
          this.referenceColumns.unset(key);
        }
        return this;
      };

      ReferencesDetail.prototype.onRefColumnChanged = function($evt) {
        var baseAge, curY, gapSize, offsetY, ref, timelines, topAge, zones;
        while (this.timelines.at(0) != null) {
          this.timelines.at(0).destroy();
        }
        ref = this.columnManager.getReferenceTimelinesAndZones()[$($evt.target).val()];
        if (ref != null) {
          topAge = this.referenceColumns.get("topAge");
          baseAge = this.referenceColumns.get("baseAge");
          gapSize = this.referenceColumns.get("gapSize");
          offsetY = this.referenceColumns.get("offsetY");
          timelines = _.filter(ref.timelines, function(timeline) {
            return timeline.age >= topAge && timeline.age <= baseAge;
          });
          zones = _.filter(ref.zones, function(zone) {
            return zone.top.age >= topAge && zone.base.age <= baseAge;
          });
          curY = offsetY;
          _.each(timelines, (function(_this) {
            return function(t) {
              var newT;
              newT = $.extend(true, {}, t);
              newT.y = curY;
              _this.timelines.addFromJSON(newT);
              return curY += gapSize;
            };
          })(this));
          _.each(zones, (function(_this) {
            return function(z) {
              var newZ;
              newZ = $.extend(true, {}, z);
              return _this.zones.addFromJSONWithAge(_this.timelines, newZ);
            };
          })(this));
        }
        return this;
      };

      return ReferencesDetail;

    })(Detail);
  });

}).call(this);
