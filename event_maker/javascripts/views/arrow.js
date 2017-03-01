(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define([], function() {
    var Point;
    return Point = (function(_super) {
      __extends(Point, _super);

      function Point() {
        this.rangeUpdated = __bind(this.rangeUpdated, this);
        this._unregisterZone = __bind(this._unregisterZone, this);
        this._registerZone = __bind(this._registerZone, this);
        this.zoneChanged = __bind(this.zoneChanged, this);
        this.zoneUpdated = __bind(this.zoneUpdated, this);
        this.stop = __bind(this.stop, this);
        this.start = __bind(this.start, this);
        this.updateRElPosition = __bind(this.updateRElPosition, this);
        this.toBack = __bind(this.toBack, this);
        this.toFront = __bind(this.toFront, this);
        this.hide = __bind(this.hide, this);
        this.show = __bind(this.show, this);
        this.unhighlight = __bind(this.unhighlight, this);
        this.highlight = __bind(this.highlight, this);
        this.unselected = __bind(this.unselected, this);
        this.selected = __bind(this.selected, this);
        this.onSelect = __bind(this.onSelect, this);
        this.updateFromXY = __bind(this.updateFromXY, this);
        this.updateFromModel = __bind(this.updateFromModel, this);
        this.isValid = __bind(this.isValid, this);
        this.onDragEnd = __bind(this.onDragEnd, this);
        this.onDragMove = __bind(this.onDragMove, this);
        this.onDragStart = __bind(this.onDragStart, this);
        this.onMouseOut = __bind(this.onMouseOut, this);
        this.onMouseOver = __bind(this.onMouseOver, this);
        this.render = __bind(this.render, this);
        this._insertAfterMe = __bind(this._insertAfterMe, this);
        this.cancelAction = __bind(this.cancelAction, this);
        this.deleteAction = __bind(this.deleteAction, this);
        this.editAction = __bind(this.editAction, this);
        this.inputUpdate = __bind(this.inputUpdate, this);
        this.destroy = __bind(this.destroy, this);
        this.template = __bind(this.template, this);
        return Point.__super__.constructor.apply(this, arguments);
      }

      Point.prototype.tagName = "div";

      Point.prototype.className = "data-list";

      Point.prototype.showTemplate = new EJS({
        url: "templates/points/show"
      });

      Point.prototype.editTemplate = new EJS({
        url: "templates/points/edit"
      });

      Point.prototype.template = function() {
        var temp;
        temp = this.isEditing ? this.editTemplate : this.showTemplate;
        return temp.render.apply(temp, arguments);
      };

      Point.prototype.isEditing = false;

      Point.prototype.isSelected = false;

      Point.prototype.normalColor = "#000000";

      Point.prototype.normalRadius = 2.5;

      Point.prototype.selectedColor = "#F155A8";

      Point.prototype.hoverRadius = 5;

      Point.prototype.events = {
        "click .sublist-edit-btn": "editAction",
        "click .point-detail.showing": "editAction",
        "click .delete-btn": "deleteAction",
        "click .sublist-cancel-btn": "cancelAction",
        "change input[type=text]": "inputUpdate",
        "mouseover": "onMouseOver",
        "mouseout": "onMouseOut"
      };

      Point.prototype.initialize = function(options) {
        this.mainCanvasView = options.mainCanvasView;
        this.columnManager = options.columnManager;
        this.isShow = options.curveOption.get("isShowPoints");
        this.zones = this.columnManager.retrieveDataForCurrentColumn("zones");
        this.ranges = this.columnManager.retrieveDataForCurrentColumn("ranges");
        this.initCanvasEl();
        this.start();
        this.listenTo(this.model, {
          "_insertAfterMe": this._insertAfterMe,
          "destroy": this.destroy
        });
        this.listenTo(this.model, {
          "selected": this.selected,
          "unselected": this.unselected,
          "highlight": this.highlight,
          "unhighlight": this.unhighlight,
          "show": this.show,
          "hide": this.hide,
          "toFront": this.toFront,
          "toBack": this.toBack,
          "change:x": this.updateRElPosition,
          "change:y": this.updateRElPosition
        });
        this.listenTo(this.model, {
          "change:x": this.render,
          "change:y": this.render,
          "change:relX": this.render,
          "change:relY": this.render,
          "change:value": this.render,
          "change:age": this.render,
          "change:zone": this.zoneChanged
        });
        this._registerZone(this.model.get("zone"));
        this.listenTo(this.zones, "updated", this.zoneUpdated);
        this.listenTo(this.ranges, "updated", this.rangeUpdated);
        this.listenTo(this.mainCanvasView, {
          "start:addingCurve": this.start,
          "stop:addingCurve": this.stop
        });
        return this;
      };

      Point.prototype.destroy = function() {
        this.stop();
        this.unselected();
        this.rEl.remove();
        this.remove();
        return this;
      };

      Point.prototype.inputUpdate = function($evt) {
        var $input, key, value;
        $input = $($evt.target);
        key = $input.attr("name");
        value = parseFloat($input.val());
        this.model.set(key, value);
        return this;
      };

      Point.prototype.editAction = function($evt) {
        $evt.stopImmediatePropagation();
        this.isEditing = true;
        this.render();
        return this;
      };

      Point.prototype.deleteAction = function($evt) {
        $evt.stopImmediatePropagation();
        this.model.destroy();
        return this;
      };

      Point.prototype.cancelAction = function($evt) {
        $evt.stopImmediatePropagation();
        this.isEditing = false;
        this.render();
        return this;
      };

      Point.prototype._insertAfterMe = function(newView) {
        this.$el.after(newView.el);
        return this;
      };

      Point.prototype.render = function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
      };

      Point.prototype.initCanvasEl = function() {
        //this.rEl = this.mainCanvasView.createCircle(this.model.get("x"), this.model.get("y"), this.normalRadius);
        //this.rEl = this.mainCanvasView.createArrow(this.model.get("x"), this.model.get("y"), "LAD");
    	//this.rEl = this.mainCanvasView.createImage  Arrow(this.model.get("x"), this.model.get("y"));
    	  var x = this.model.get("x");
    	  var y = this.model.get("y");
    	  var move = "M " + x + "," + y + " ";
    	  var newX = x + 30;
    	  var line = "L " + newX + ", " + y + " ";
    	  //var rest = "L 175,225 z"
    	  var dr = move + line;
          this.rEl = this.mainCanvasView.createPath(dr);//"M 150,200 L 150,250 L 175,225 z");  
    	  
          this.rEl.attr({
        	  stroke: this.normalColor,
        	  "stroke-width": 5,
        	  fill: this.normalColor,
        	  "fill-opacity": 5,
          });
          if (this.isShow) {
        	  this.show();
          } else {
        	  this.hide();
          }
        return this;
      };

      Point.prototype.onMouseOver = function() {
        this.$el.addClass('hover');
        this.highlight();
        return this;
      };

      Point.prototype.onMouseOut = function() {
        this.$el.removeClass('hover');
        this.unhighlight();
        return this;
      };

      Point.prototype.onDragStart = function(x, y, evt) {
        this._abovePoint = this.model.getAbovePoint();
        this._belowPoint = this.model.getBelowPoint();
        return this;
      };

      Point.prototype.onDragMove = function(dx, dy, x, y, evt) {
        var locationX, locationY, position;
        position = this.mainCanvasView.getCurrentPositionFromEvt(evt);
        locationX = TSCreator.utils.math.roundD4(position.x);
        locationY = TSCreator.utils.math.roundD4(position.y);
        if (!this.isValid(locationX, locationY)) {
          return;
        }
        this.updateFromXY(locationX, locationY);
        return this;
      };

      Point.prototype.onDragEnd = function(evt) {
        delete this._abovePoint;
        delete this._belowPoint;
        return this;
      };

      Point.prototype.isValid = function(x, y) {
        var slack;
        slack = 1;
        if ((this._abovePoint != null) && (this._belowPoint != null) && (this._abovePoint.get('y') + slack > y || y > this._belowPoint.get('y') - slack)) {
          return false;
        }
        if ((this._abovePoint == null) && (this._belowPoint != null) && y > this._belowPoint.get('y') - slack) {
          return false;
        }
        if ((this._abovePoint != null) && (this._belowPoint == null) && this._abovePoint.get('y') + slack > y) {
          return false;
        }
        if (!this.ranges.isXValid(x)) {
          return false;
        }
        if (!this.zones.isYValid(y)) {
          return false;
        }
        return true;
      };

      Point.prototype.updateFromModel = function() {
        this.updateFromXY(this.model.get("x"), this.model.get("y"));
        return this;
      };

      Point.prototype.updateFromXY = function(x, y) {
        var age, relativeX, relativeY, value, zone, _ref, _ref1;
        _ref = this.ranges.getRelativeXAndValueForX(x), relativeX = _ref[0], value = _ref[1];
        _ref1 = this.zones.getZoneAndRelativeYAndAgeForY(y), zone = _ref1[0], relativeY = _ref1[1], age = _ref1[2];
        this.model.set({
          x: x,
          y: y,
          relX: relativeX,
          value: value,
          relY: relativeY,
          zone: zone,
          age: age
        });
        return this;
      };

      Point.prototype.onSelect = function(evt) {
        evt.stopImmediatePropagation();
        this.model.collection.trigger("selectThis");
        return this;
      };

      Point.prototype.selected = function() {
        if (!this.isSeleted) {
          this.isSelected = true;
          this.rEl.attr({
            fill: this.selectedColor
          });
          this.rEl.drag(this.onDragMove, this.onDragStart, this.onDragEnd);
        }
        this.toFront();
        return this;
      };

      Point.prototype.unselected = function() {
        if (this.isSelected) {
          this.isSelected = false;
          this.rEl.undrag();
          this.rEl.attr({
            fill: this.normalColor
          });
        }
        return this;
      };

      Point.prototype.highlight = function() {
        this.rEl.attr({
          r: this.hoverRadius
        });
        return this;
      };

      Point.prototype.unhighlight = function() {
        this.rEl.attr({
          r: this.normalRadius
        });
        return this;
      };

      Point.prototype.show = function() {
        this.isShow = true;
        this.rEl.show();
        return this;
      };

      Point.prototype.hide = function() {
        this.isShow = false;
        this.rEl.hide();
        return this;
      };

      Point.prototype.toFront = function() {
        this.rEl.toFront();
        return this;
      };

      Point.prototype.toBack = function() {
        this.rEl.toBack();
        return this;
      };

      Point.prototype.updateRElPosition = function(m) {
        this.rEl.attr({
          cx: m.get("x"),
          cy: m.get("y")
        });
        return this;
      };

      Point.prototype.start = function() {
        this.rEl.hover(this.onMouseOver, this.onMouseOut);
        this.rEl.click(this.onSelect);
        return this;
      };

      Point.prototype.stop = function() {
        this.rEl.unclick();
        this.rEl.unhover();
        return this;
      };

      Point.prototype.zoneUpdated = function(topY, baseY) {
        if (topY <= this.model.get("y") && baseY >= this.model.get("y")) {
          this.updateFromModel();
        }
        return this;
      };

      Point.prototype.zoneChanged = function(m, newZone, options) {
        this._unregisterZone(m.previous("zone"));
        this._registerZone(newZone);
        this.updateFromModel();
        return this;
      };

      Point.prototype._registerZone = function(zone) {
        if ((zone != null) && zone.get) {
          this.listenTo(zone, "change:name", this.render);
          this.listenTo(zone.get("top"), "change:y", this.updateFromModel);
          this.listenTo(zone.get("base"), "change:y", this.updateFromModel);
        }
        return this;
      };

      Point.prototype._unregisterZone = function(zone) {
        if ((zone != null) && zone.get) {
          this.stopListening(zone, "change:name", this.render);
          this.stopListening(zone.get("top"), "change:y", this.updateFromModel);
          this.stopListening(zone.get("base"), "change:y", this.updateFromModel);
        }
        return this;
      };

      Point.prototype.rangeUpdated = function() {
        this.updateFromModel();
        return this;
      };

      return Point;

    })(Backbone.View);
  });

}).call(this);
