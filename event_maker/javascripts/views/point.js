(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define([], function() {
    var Point;
    return Point = (function(_super) {
      __extends(Point, _super);

      function Point() {
    	this.changeEventType = __bind(this.changeEventType, this);
    	this.changeEventLineType = __bind(this.changeEventLineType, this);
    	this.changeImage = __bind(this.changeImage, this);
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
        "mouseout": "onMouseOut",
      };
      
      Point.prototype.initialize = function(options) {
        this.curveOption = options.curveOption;
        this.imageSource = null;
        this.rImage = null;
    	this.INITIAL_LAD_EVENT_PATH = null;
    	this.eventType = options.curveOption.get("eventType");
    	this.eventLineType = options.curveOption.get("eventLineType");
        this.mainCanvasView = options.mainCanvasView;
        this.columnManager = options.columnManager;
        this.isShow = options.curveOption.get("isShowPoints");
        this.zones = this.columnManager.retrieveDataForCurrentColumn("zones");
        this.ranges = this.columnManager.retrieveDataForCurrentColumn("ranges");
        this.initCanvasEl(options);
        this.start();

        this.listenTo(this.curveOption,
        {
          "change:eventType": this.changeEventType,
          "change:eventLineType": this.changeEventLineType,
          "change:imageFileEvent": this.changeImage
        });

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
        if (this.rImage != null)
            this.rImage.remove();
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

      Point.prototype.loadEventImage = function($evt) {
          var imageFile, reader;
          var e = $evt.get('imageFileEvent')
          if (e.originalEvent.dataTransfer.files.length === 1) {
            imageFile = e.originalEvent.dataTransfer.files[0];
            this.curveOption.set('imageFile', imageFile);
            this.curveOption.set('imageFileName', imageFile.name);
            this.curveOption.set('imageFileType', imageFile.type);
            reader = new FileReader();
            reader.readAsDataURL(imageFile);
            reader.onload = this.readEventImage.bind(this);
          }
          return this;
        };

      Point.prototype.drawImage = function() {
      	  var width = 80;
      	  var height = 80;
      	  var offset = 20;

          var leftRangeX = this.ranges.getLeftRange().get('x');
          var rightRangeX = this.ranges.getRightRange().get('x');

          if (this.eventType == 'FAD' || this.eventType == 'EVENT') {
      	    var x = this.model.get('x') - width - offset;
      	    var y = this.model.get('y') - height - offset;
          } else if (this.eventType == 'LAD'){
      	    var x = this.model.get('x') + offset;
      	    var y = this.model.get('y') - height - offset;
          }
      	  if (this.rImage != null) {
      		  this.rImage.remove();
      	  }
      	  this.rImage = this.mainCanvasView.rPaper.image(this.imageSource, x, y, width, height);
      
          return this;
      }

      Point.prototype._asyncGetImageDimension = function(callback, imageData) {
      	  var img;
      	  img = new Image();
      	  $(img).load(function($loadEvt) {
                return callback({
                  width: img.width,
                  height: img.height
                });
      	  });
      	  img.src = imageData;

          this.imageSource = img.src;
          
          this.drawImage();
            
      	  return this;
      };

      Point.prototype.readEventImage = function($evt) { //this evt carries the Point class
          var imageData;
          imageData = $evt.target.result;
          this.curveOption.set('imageData', imageData);
          this._asyncGetImageDimension((function(_this) {
            return function(dimension) {
                console.log("Image drawing succeeded.");
            };
          })(this), imageData);
          return this;
      };


      Point.prototype.changeImage = function(evt) {
    	  this.loadEventImage(evt);
    	  return this;
      }
        

      Point.prototype.drawEvent = function(eventType, eventLineType) {
   		  var x = this.model.get("x");
   		  var y = this.model.get("y");
          var leftRangeX = this.ranges.getLeftRange().get('x');
          var rightRangeX = this.ranges.getRightRange().get('x');
    	  if (eventType == "FAD" || eventType == "EVENT") {
    		  var move = "M " + x + "," + y + " ";
    		  var newX = x - 15;
    		  var line = "L " + newX + ", " + y + " ";
    		  var newY = y - 10;
    		  var arrow_point = x - 7.5;
    		  var rest = "L " + arrow_point + "," + newY + " ";
    		  var dr = move + rest + line;
    		  var horizontal_line = move + " " + "L " + leftRangeX + ", " + y + " ";
    		  var dr = dr + horizontal_line;
    	  } else if (eventType == "LAD" ) {
    		  var move = "M " + x + "," + y + " ";
    		  var newX = x - 15;
    		  var line = "L " + newX + ", " + y + " ";
    		  var newY = y + 10;
    		  var arrow_point = x - 7.5;
    		  var rest = "L " + arrow_point + "," + newY + " ";
    		  var dr = move + rest + line;
              var horizontal_line = move + " " + "L " + (x - 15) + "," + y + " " + "L " + rightRangeX + ", " + y + " ";
    		  var dr = dr + horizontal_line;
    	  } 

   		  this.model.set("eventType", eventType);
    	  
   		  this.rEl = this.mainCanvasView.createPath(dr);  
          this.rEl.attr({
        	  "stroke": this.normalColor,
        	  "stroke-width": 1,
        	  "fill": "#000000",
        	  "fill-opacity": 5,
          });

    	  if (eventLineType == "solid") {
    		  this.rEl.attr({
    			  "stroke-dasharray" : "" 
    		  });
    	  } else if (eventLineType == "dotted") {
    		  this.rEl.attr({
    			  "stroke-dasharray" : "." 
    		  });
    	  } else if (eventLineType == "dashed") {
    		  this.rEl.attr({
    			  "stroke-dasharray" : "--" 
    		  });
    	  } else {
    		  console.log("Event Line Type issue.")
    	  }

          this.INITIAL_LAD_EVENT_PATH= Object.create(this.rEl.attr("path"));

    	  var pathArray = JSON.parse(JSON.stringify(this.rEl.attr("path")));
    	  // rewriting the path with initial LAD event path
    	  for (i=0; i < this.INITIAL_LAD_EVENT_PATH.length; i++) {
    		  for (j=0; j < this.INITIAL_LAD_EVENT_PATH[i].length; j++) {
    			  pathArray[i][j] = this.INITIAL_LAD_EVENT_PATH[i][j];
    		  }
    	  }
    	  var lineY = pathArray[0][2];
    	  var diff = pathArray[1][2] - lineY;

          /*
          if (eventType == "LAD") {
          } else if (eventType == "FAD") {
              pathArray[1][2] = lineY - diff; 
          } else */ 
          if (eventType == "EVENT") {
              pathArray[2][1] = pathArray[1][1];
              pathArray[2][2] = lineY-diff;

              this.rEl.attr({
                 path: JSON.parse(JSON.stringify(pathArray)) 
              });
          } 
          /*
          else {
          }*/

          this.model.set("eventPath", this.rEl.attr("path"));

          if (this.rImage != null)
              this.rImage.remove();

          this.drawImage();
          
        if (this.isShow) {
          this.show();
        } else {
          this.hide();
        }
      }
      
      Point.prototype.initCanvasEl = function(options) {
    	var eventType = options.curveOption.get("eventType"); 
        var eventLineType = options.curveOption.get("eventLineType");
    	this.model.set("curveOption", options.curveOption);
    	this.drawEvent(eventType, eventLineType);
        return this;
      };
      
      Point.prototype.changeEventType = function() {
          this.eventType = this.curveOption.get("eventType");
          this.rEl.remove();
    	  this.drawEvent(this.eventType, this.eventLineType);
    	  return this;
      }

      Point.prototype.changeEventLineType = function() {
          this.eventLineType = this.curveOption.get("eventLineType");
          this.rEl.remove();
    	  this.drawEvent(this.eventType, this.eventLineType);
    	  return this;
      }

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
    	  var pathArray = JSON.parse(JSON.stringify(this.rEl.attr("path")));

    	  // rewriting the path with initial LAD event path
    	  for (i=0; i < this.INITIAL_LAD_EVENT_PATH.length; i++) {
    		  var diff = y - this.INITIAL_LAD_EVENT_PATH[i][2] ;
    		  pathArray[i][2] = this.INITIAL_LAD_EVENT_PATH[i][2] + y - 400;
    	  }
    	  
    	  this.rEl.attr({
        	  path: JSON.parse(JSON.stringify(pathArray)) 
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
        this.rEl.dblclick(this.onSelect);
        return this;
      };

      Point.prototype.stop = function() {
        this.rEl.undblclick();
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
        //this.updateFromModel();
        return this;
      };

      return Point;

    })(Backbone.View);
  });

}).call(this);
