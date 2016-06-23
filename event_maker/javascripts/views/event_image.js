(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["./detail"], function(Detail) {
    var EventImageDetail;
    return EventImageDetail = (function(_super) {
      __extends(EventImageDetail, _super);

      function EventImageDetail() {
        this.onIsPreserveAspectRatioChange = __bind(this.onIsPreserveAspectRatioChange, this);
        this.onIsVisibleChange = __bind(this.onIsVisibleChange, this);
        this.onRotationChange = __bind(this.onRotationChange, this);
        this.onCurHeightChange = __bind(this.onCurHeightChange, this);
        this.onCurWidthChange = __bind(this.onCurWidthChange, this);
        this.updateIsPreserveAspectRatioInput = __bind(this.updateIsPreserveAspectRatioInput, this);
        this.updateIsVisibleInput = __bind(this.updateIsVisibleInput, this);
        this.updateRotationInput = __bind(this.updateRotationInput, this);
        this.updateCurHeightInput = __bind(this.updateCurHeightInput, this);
        this.updateCurWidthInput = __bind(this.updateCurWidthInput, this);
        this.changeEventImageAttributes = __bind(this.changeEventImageAttributes, this);
        this.changeEventImage = __bind(this.changeEventImage, this);
        this.readEventImage = __bind(this.readEventImage, this);
        this.loadEventImage = __bind(this.loadEventImage, this);
        return EventImageDetail.__super__.constructor.apply(this, arguments);
      }

      EventImageDetail.prototype.events = {
        "drop .image-dropbox": "loadEventImage",
        "change input[name=curWidth]": "onCurWidthChange",
        "change input[name=curHeight]": "onCurHeightChange",
        "change input[name=rotation]": "onRotationChange",
        "click input[name=isVisible]": "onIsVisibleChange",
        "click input[name=isPreserveAspectRatio]": "onIsPreserveAspectRatioChange"
      };

      EventImageDetail.prototype.initialize = function(options) {
        EventImageDetail.__super__.initialize.call(this, options);
        this.image = this.columnManager.retrieveDataForCurrentColumn("EventImage");
        this.listenTo(this.image, {
          "change:dataURL": this.changeEventImage,
          "change:curWidth change:curHeight": this.changeEventImageAttributes,
          "change:rotation change:isVisible": this.changeEventImageAttributes,
          "change:curWidth": this.updateCurWidthInput,
          "change:curHeight": this.updateCurHeightInput,
          "change:rotation": this.updateRotationInput,
          "change:isVisible": this.updateIsVisibleInput,
          "change:isPreserveAspectRatio": this.updateIsPreserveAspectRatioInput
        });
        return this;
      };

      EventImageDetail.prototype.loadEventImage = function($evt) {
        var imageFile, reader;
        $evt.preventDefault();
        $evt.stopPropagation();
        if ($evt.originalEvent.dataTransfer.files.length === 1) {
          imageFile = $evt.originalEvent.dataTransfer.files[0];
          reader = new FileReader();
          reader.onload = this.readEventImage;
          reader.readAsDataURL(imageFile);
        }
        return this;
      };

      EventImageDetail.prototype.readEventImage = function(evt) {
        var imageData;
        imageData = evt.target.result;
        this._asyncGetImageDimension((function(_this) {
          return function(dimension) {
            return _this.image.set({
              dataURL: imageData,
              origWidth: dimension.width,
              origHeight: dimension.height,
              curWidth: dimension.width,
              curHeight: dimension.height
            });
          };
        })(this), imageData);
        return this;
      };

      EventImageDetail.prototype._asyncGetImageDimension = function(callback, imageData) {
        var img;
        img = new Image();
        $(img).load(function($loadEvt) {
          return callback({
            width: img.width,
            height: img.height
          });
        });
        img.src = imageData;
        return this;
      };

      EventImageDetail.prototype.changeEventImage = function(m, imageData, options) {
        if (this.rEventImage != null) {
          this.rEventImage.remove();
        }
        this.rEventImage = this.mainCanvasView.createImage(imageData);
        this.rEventImage.toBack();
        return this;
      };

      EventImageDetail.prototype.changeEventImageAttributes = function(m, value, options) {
        if (this.rEventImage != null) {
          this.rEventImage.attr({
            width: m.get("curWidth"),
            height: m.get("curHeight"),
            transform: "r" + (m.get("rotation")),
            x: 0,
            y: 0
          });
          if (m.get("isVisible")) {
            this.rEventImage.show();
          } else {
            this.rEventImage.hide();
          }
        }
        return this;
      };

      EventImageDetail.prototype.updateCurWidthInput = function(m, value) {
        var $input;
        $input = this.$el.find("input[name=curWidth]");
        if ($input.val() !== value) {
          $input.val(value);
        }
        return this;
      };

      EventImageDetail.prototype.updateCurHeightInput = function(m, value) {
        var $input;
        $input = this.$el.find("input[name=curHeight]");
        if ($input.val() !== value) {
          $input.val(value);
        }
        return this;
      };

      EventImageDetail.prototype.updateRotationInput = function(m, value) {
        var $input;
        $input = this.$el.find("input[name=rotation]");
        if ($input.val() !== value) {
          $input.val(value);
        }
        return this;
      };

      EventImageDetail.prototype.updateIsVisibleInput = function(m, value) {
        var $input;
        $input = this.$el.find("input[name=isVisible]");
        if ($input.prop("checked") !== this.image.get("isVisible")) {
          $input.prop("checked", this.image.get("isVisible"));
        }
        return this;
      };

      EventImageDetail.prototype.updateIsPreserveAspectRatioInput = function(m, value) {
        var $input;
        $input = this.$el.find("input[name=isPreserveAspectRatio]");
        if ($input.prop("checked") !== this.image.get("isPreserveAspectRatio")) {
          $input.prop("checked", this.image.get("isPreserveAspectRatio"));
        }
        return this;
      };

      EventImageDetail.prototype.onCurWidthChange = function($evt) {
        var value;
        value = parseInt($($evt.target).val());
        if (this.image.get("isPreserveAspectRatio")) {
          this.image.set({
            curWidth: value,
            curHeight: parseInt(value / this.image.get("origWidth") * this.image.get("origHeight"))
          });
        } else {
          this.image.set({
            curWidth: value
          });
        }
        return this;
      };

      EventImageDetail.prototype.onCurHeightChange = function($evt) {
        var value;
        value = parseInt($($evt.target).val());
        if (this.image.get("isPreserveAspectRatio")) {
          this.image.set({
            curWidth: parseInt(value / this.image.get("origHeight") * this.image.get("origWidth")),
            curHeight: value
          });
        } else {
          this.image.set({
            curHeight: value
          });
        }
        return this;
      };

      EventImageDetail.prototype.onRotationChange = function($evt) {
        var value;
        value = parseFloat($($evt.target).val());
        this.image.set({
          rotation: value
        });
        return this;
      };

      EventImageDetail.prototype.onIsVisibleChange = function($evt) {
        var value;
        value = $($evt.target).prop("checked");
        this.image.set({
          isVisible: value
        });
        return this;
      };

      EventImageDetail.prototype.onIsPreserveAspectRatioChange = function($evt) {
        var value;
        value = $($evt.target).prop("checked");
        this.image.set({
          isPreserveAspectRatio: value
        });
        return this;
      };

      return EventImageDetail;

    })(Detail);
  });

}).call(this);
