(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define([], function() {
    var CurveOption;
    return CurveOption = (function(_super) {
      __extends(CurveOption, _super);

      function CurveOption() {
        this.render = __bind(this.render, this);
        this.updateWrapper = __bind(this.updateWrapper, this);
        this.toggleWrapper = __bind(this.toggleWrapper, this);
        this.destroy = __bind(this.destroy, this);
        this.eventAgeAction = __bind(this.eventAgeAction, this);
        this.eventPopupAction = __bind(this.eventPopupAction, this);
        this.eventReferenceAction = __bind(this.eventReferenceAction, this);
        this.eventLineTypeAction = __bind(this.eventLineTypeAction, this);
        this.eventTypeAction = __bind(this.eventTypeAction, this);
        this.fillColorAction = __bind(this.fillColorAction, this);
        this.fillCurveAction = __bind(this.fillCurveAction, this);
        this.dropImageAction = __bind(this.dropImageAction, this);
        this.showLinesAction = __bind(this.showLinesAction, this);
        this.showPointsAction = __bind(this.showPointsAction, this);
        this.smoothedAction = __bind(this.smoothedAction, this);
        this.changeFillColor = __bind(this.changeFillColor, this);
        this.changeEventAge = __bind(this.changeEventAge, this);
        this.changeEventPopup = __bind(this.changeEventPopup, this);
        this.changeEventPopup = __bind(this.changeEventReference, this);
        this.changeLineType = __bind(this.changeLineType, this);
        this.changeEventType = __bind(this.changeEventType, this);
        this.changeIsFillCurve = __bind(this.changeIsFillCurve, this);
        this.changeIsShowLines = __bind(this.changeIsShowLines, this);
        this.changeIsShowPoints = __bind(this.changeIsShowPoints, this);
        this.changeIsSmoothed = __bind(this.changeIsSmoothed, this);
        this.changeImage = __bind(this.changeImage, this);

        this.detachEl = __bind(this.detachEl, this);
        return CurveOption.__super__.constructor.apply(this, arguments);
      }

      CurveOption.prototype.className = "display-options";

      CurveOption.prototype.template = new EJS({
        url: "templates/events/option"
      });

      CurveOption.prototype.isExpanded = true;

      CurveOption.prototype.events = {
        "click .sublist-header": "toggleWrapper",
        "click .smoothed-btn": "smoothedAction",
        "click .show-points-btn": "showPointsAction",
        "click .show-lines-btn": "showLinesAction",
        "click .fill-curve-btn": "fillCurveAction",
        "change input[name=fillColor]": "fillColorAction",
        "change input[name=eventAge]": "eventAgeAction",
        "change input[name=eventPopup]": "eventPopupAction",
        "change input[name=eventReference]": "eventReferenceAction",
        "change input[name=event-type]": "eventTypeAction",
        "change input[name=event-line-type]": "eventLineTypeAction",
        "drop .image-dropbox": "dropImageAction"
      };

      CurveOption.prototype.initialize = function(options) {
        this.points = options.points;
        this.lines = options.lines;
        this.listenTo(this.model, "destroy", this.destroy);
        this.listenTo(this.model, {
          "change:isSmoothed": this.changeIsSmoothed,
          "change:isShowPoints": this.changeIsShowPoints,
          "change:isShowLines": this.changeIsShowLines,
          "change:isFillCurve": this.changeIsFillCurve,
          "change:fillColor": this.changeFillColor,
          "change:eventAge" : this.changeEventAge,
          "change:eventPopup" : this.changeEventPopup,
          "change:eventReference" : this.changeEventReference,
          "change:eventLineType" : this.changeEventLineType,
          "change:eventType": this.changeEventType,
          "change:imageFileEvent": this.changeImage
        });
        return this;
      };

      CurveOption.prototype.detachEl = function() {
        this.$el.detach();
        return this;
      };
      
      CurveOption.prototype.changeImage = function($evt) {
          var imageFile, reader;
//          console.log("Curve Option Change Image.");
//          $evt.preventDefault();
//          $evt.stopPropagation();
//          if ($evt.originalEvent.dataTransfer.files.length === 1) {
//            imageFile = $evt.originalEvent.dataTransfer.files[0];
//            reader = new FileReader();
//            reader.onload = this.readEventImage;
//            reader.readAsDataURL(imageFile);
//          }
          return this;
        };

      CurveOption.prototype.changeIsSmoothed = function(m, value, options) {
        var $button;
        $button = this.$el.find(".smoothed-btn");
        if (value) {
          $button.removeClass("off");
        } else {
          $button.addClass("off");
        }
        return this;
      };

      CurveOption.prototype.changeIsShowPoints = function(m, value, options) {
        var $button;
        $button = this.$el.find(".show-points-btn");
        if (value) {
          $button.removeClass("off");
        } else {
          $button.addClass("off");
        }
        return this;
      };

      CurveOption.prototype.changeIsShowLines = function(m, value, options) {
        var $button;
        $button = this.$el.find(".show-lines-btn");
        if (value) {
          $button.removeClass("off");
        } else {
          $button.addClass("off");
        }
        return this;
      };

      CurveOption.prototype.changeIsFillCurve = function(m, value, options) {
        var $button;
        $button = this.$el.find(".fill-curve-btn");
        if (value) {
          $button.removeClass("off");
        } else {
          $button.addClass("off");
        }
        return this;
      };

      CurveOption.prototype.changeFillColor = function(m, value, options) {
        var $input;
        $input = this.$el.find("input[name=fillColor]");
        $input.val(value);
        return this;
      };
      
      CurveOption.prototype.changeEventType = function(m, value, options) {
    	 var $input, $eventType;
    	 $eventType = value;

    	 return this;
      }

      CurveOption.prototype.changeEventLineType = function(m, value, options) {
    	 var $input, $eventType;
    	 $eventType = value;

    	 return this;
      }

      CurveOption.prototype.changeEventAge = function(m, value, options) {
    	 var $input, $eventAge;
    	 $eventAge = value;
         $input = this.$el.find("input[name=eventAge]");
         $input.val($eventAge);

    	 return this;
      }
      CurveOption.prototype.changeEventReference = function(m, value, options) {
    	 var $input, $eventReference;
    	 $eventReference = value;

    	 return this;
      }

      CurveOption.prototype.smoothedAction = function($evt) {
        var value;
        value = $($evt.target).hasClass("off");
        this.model.set("isSmoothed", value);
        return this;
      };

      CurveOption.prototype.showPointsAction = function($evt) {
        var value;
        value = $($evt.target).hasClass("off");
        this.model.set("isShowPoints", value);
        return this;
      };

      CurveOption.prototype.showLinesAction = function($evt) {
        var value;
        value = $($evt.target).hasClass("off");
        this.model.set("isShowLines", value);
        return this;
      };

      CurveOption.prototype.fillCurveAction = function($evt) {
        var value;
        value = $($evt.target).hasClass("off");
        this.model.set("isFillCurve", value);
        return this;
      };

      CurveOption.prototype.fillColorAction = function($evt) {
        this.model.set("fillColor", $($evt.target).val());
        return this;
      };

      CurveOption.prototype.eventAgeAction = function($evt) {
        this.model.set("eventAge", $($evt.target).val());
        return this;
      };

      CurveOption.prototype.eventPopupAction = function($evt) {
        this.model.set("eventPopup", $($evt.target).val());
        return this;
      };

      CurveOption.prototype.eventReferenceAction = function($evt) {
        this.model.set("eventReference", $($evt.target).val());
        return this;
      };

      CurveOption.prototype.dropImageAction = function($evt) {
        this.model.set("imageFileEvent", $evt);
        return this;
      };

      CurveOption.prototype.eventLineTypeAction = function($evt) {
        this.model.set("eventLineType", $($evt.target).val());
        return this;
      };

      CurveOption.prototype.eventTypeAction = function($evt) {
        this.model.set("eventType", $($evt.target).val());
        return this;
      };

      CurveOption.prototype.destroy = function() {
        this.remove();
        return this;
      };

      CurveOption.prototype.toggleWrapper = function() {
        this.isExpanded = !this.isExpanded;
        this.updateWrapper();
        return this;
      };

      CurveOption.prototype.updateWrapper = function() {
        if (this.isExpanded) {
          this.$el.find(".sublist-header .icon-btn").removeClass("sublist-edit-btn").addClass("sublist-cancel-btn");
          this.$el.children().not(".sublist-header").show();
        } else {
          this.$el.find(".sublist-header .icon-btn").removeClass("sublist-cancel-btn").addClass("sublist-edit-btn");
          this.$el.children().not(".sublist-header").hide();
        }
        return this;
      };

      CurveOption.prototype.render = function() {
        this.$el.html(this.template.render(this.model.toJSON()));
        return this;
      };

      return CurveOption;

    })(Backbone.View);
  });

}).call(this);
