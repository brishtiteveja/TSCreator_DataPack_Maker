define([
    "baseView",
    "lithologyGroupView",
    "lithologyGroupMarkerView",
    "lithologyGroup",
    "lithologyGroupMarker",
    "polygonView",
    "point",
    "pointView"
], function (
    BaseView,
    LithologyGroupView,
    LithologyGroupMarkerView,
    LithologyGroup,
    LithologyGroupMarker,
    PolygonView,
    Point,
    PointView
) {

    var LithologyColumnView = BaseView.extend({
        tagName: "li",
        classname: "LithologyColumnView",
        events: {
            'click .lithology-column-data': 'toggleForm',
            'click .lithology-column-form>.data-labels': 'toggleForm',
            'click a[href="#lithology-column-destroy"]': 'destroy',
            'click a[href="#add-overlay"]': 'addOverlay',
            'click a[href="#edit-overlay"]': 'editOverlay',
            'click a[href="#finish-overlay"]': 'finishOverlay',
            'click label.lithology-column-lithologys-data': 'showLithologyGroupsList',
            'keypress :input.lithology-column': 'updateLithologyColumn',
            'keyup :input.lithology-column': 'updateLithologyColumn',
            'change input[name="lithology-column-bg-color"]': 'updateLithologyColumn',
            'mouseover': "onMouseOver",
            'mouseout': "onMouseOut",
        }
    });

    LithologyColumnView.prototype.template = new EJS({
        url: '../../lithology_column_maker/ejs/lithology_column.ejs'
    });

    LithologyColumnView.prototype.colInfoTemplate = new EJS({
        url: '../../lithology_column_maker/ejs/lithology_column_info.ejs'
    });

    LithologyColumnView.prototype.initialize = function (app, lithologyColumn) {
        this.app = app;
        this.lithologyColumn = lithologyColumn;
		this.lithologyColumn.lithologyColumnView = this;
        this.listenToEvents();
        this.render();
    };

    LithologyColumnView.prototype.listenToEvents = function () {
        this.listenTo(this.lithologyColumn, 'update', this.renderColumnInfo.bind(this));
        this.listenTo(this.lithologyColumn, 'change', this.renderLithologyColumn.bind(this));
		this.listenTo(this.lithologyColumn, 'change:hover', this.setHoverStatus.bind(this));
        this.listenTo(this.lithologyColumn.get('settings'), 'change', this.renderLithologyColumn.bind(this));
        this.listenTo(this.lithologyColumn.get('lithologyGroupMarkers'), 'add', this.addLithologyGroupMarker.bind(
            this));
        this.listenTo(this.lithologyColumn.get('lithologyGroups'), 'remove', this.removeLithology.bind(this));
        this.listenTo(this.lithologyColumn.get('lithologyGroups'), 'add', this.addLithologyGroup.bind(this));
        this.listenTo(this.lithologyColumn, 'destroy', this.delete.bind(this));
    };

    LithologyColumnView.prototype.render = function () {
        this.$el.html(this.template.render(this.lithologyColumn.toJSON()));
        this.$lithologyGroupsList = this.$('.lithology-groups-list');
        this.$lithologyPolygon = this.$('.lithology-polygon');
        this.renderColumnInfo();
    }

    LithologyColumnView.prototype.renderColumnInfo = function () {
        this.$(".column-info").html(this.colInfoTemplate.render(this.lithologyColumn.toJSON()));

        /* get DOM elements after render */
        this.$toggle = this.$(".toggle");
        this.$lithologyColumnForm = this.$(".lithology-column-form");
        this.$lithologyColumnData = this.$(".lithology-column-data");
        this.$lithologyColumnName = this.$('input[name="lithology-column-name"]')[0];
        this.$lithologyColumnWidth = this.$('input[name="lithology-column-width"]')[0];
        this.$lithologyColumnBgColor = this.$('input[name="lithology-column-bg-color"]')[0];
        this.$lithologyColumnDescription = this.$('textarea[name="lithology-column-description"]')[0];

        this.$lithologyColumnLat = this.$('input[name="lithology-column-lat"]')[0];
        this.$lithologyColumnLon = this.$('input[name="lithology-column-lon"]')[0];

        this.$addOverlay = this.$('a[href="#add-overlay"]');
        this.$editOverlay = this.$('a[href="#edit-overlay"]');
        this.$finishOverlay = this.$('a[href="#finish-overlay"]');
        this.$overlayTool = this.$(".overlay-tool");

        this.renderLithologyColumn();
        this.resizePaper();
    }

    LithologyColumnView.prototype.renderLithologyColumn = function () {
        if (this.element === undefined) {
            this.element = this.app.Paper.rect();
            this.headingBox = this.app.Paper.rect();
            this.headingText = this.app.Paper.text();

            /* attach listeners to the element */
            this.element.dblclick(this.createLithologyGroupMarker.bind(this));
            this.element.hover(this.onMouseOver.bind(this), this.onMouseOut.bind(this));
			this.element.drag(this.dragMove.bind(this), this.dragStart.bind(this), this.dragEnd.bind(this));

            this.app.MarkersSet.toFront();
        }

        this.element.attr({
            x: this.lithologyColumn.get('x'),
            y: 0,
            width: this.lithologyColumn.get('width'),
            fill: this.lithologyColumn.get('settings').get('backgroundColor'),
            height: this.app.Paper.height,
            opacity: 0.3,
        });

        this.headingBox.attr({
            x: this.lithologyColumn.get('x'),
            y: 0,
            width: this.lithologyColumn.get('width'),
            fill: "#FFFFFF",
            height: 50,
            opacity: 0.3,
        });

        var textX = Math.round(this.lithologyColumn.get('x') + this.lithologyColumn.get('width') / 2);
        var textY = 25
        var textSize = this.lithologyColumn.get('width') / 5.0 * 0.5;

        this.headingText.attr({
            "x": textX,
            "y": textY,
            "text": this.lithologyColumn.get('name'),
            "font-size": textSize,
        });

        if (this.lithologyColumn.get('polygon') && !this.polygonView) {
            this.listenTo(this.lithologyColumn.get('polygon'), 'change:draw', this.updateButtons.bind(this));
            this.listenTo(this.lithologyColumn.get('polygon'), 'destroy', this.deletePolygon.bind(this));
            this.polygonView = new PolygonView(this.app.lithology2dView.app, this.lithologyColumn.get('polygon'));
            this.$(".overlay").html(this.polygonView.el);
        }

        if (this.lithologyColumn.get('polygon')) {
            this.lithologyColumn.get('polygon').set({
                'name': this.lithologyColumn.get('name')
            });
            this.lithologyColumn.get('polygon').update();
        }

        if (this.lithologyColumn.get('lat') && this.lithologyColumn.get('lat') && !this.lithologyColumn.get('point')) {
            this.lithologyColumn.set({
                point: new Point({})
            })
        }

        if (this.lithologyColumn.get('point')) {
            this.lithologyColumn.get('point').set({
                lat: this.lithologyColumn.get('lat'),
                lon: this.lithologyColumn.get('lon')
            });

            if (!this.pointView) {
                this.pointView = new PointView(this.app.lithology2dApp, this.lithologyColumn.get('point'));
                this.pointView.makePointRed();
            }

            this.app.lithology2dApp.map.center({
                lat: this.lithologyColumn.get('lat'),
                lon: this.lithologyColumn.get('lon')
            })
        }

        this.updateLithologyColumns();
    }

    LithologyColumnView.prototype.resetLithologyGroups = function () {
        this.$lithologyGroupsList.html('');
        this.lithologyColumn.get('lithologyGroups').each(this.addLithology.bind(this));
    }

    LithologyColumnView.prototype.renderLithologys = function () {
        this.lithologyColumn.get('lithologyGroups').each(this.addLithologyGroupMarker.bind(this));
    }

    LithologyColumnView.prototype.toggleForm = function () {
        this.$lithologyColumnForm.toggleClass('hide');
        this.$lithologyColumnData.toggleClass('hide');
        this.$toggle.toggleClass('hide-data');
        this.$toggle.toggleClass('show-data');
    };

    LithologyColumnView.prototype.delete = function () {
        if (this.element !== undefined) this.element.remove();
        this.$el.remove();
        this.remove();
    }


    LithologyColumnView.prototype.updateLithologyColumn = function (evt) {

        if (evt.keyCode == TimescaleApp.ENTER || evt.keyCode == TimescaleApp.ESC) {
            this.lithologyColumn.update();
        }

        var name = this.$lithologyColumnName.value;
        var description = this.$lithologyColumnDescription.value;
        var width = this.$lithologyColumnWidth.value;
        var bgColor = this.$lithologyColumnBgColor.value;
        var lat = this.$lithologyColumnLat.value;
        var lon = this.$lithologyColumnLon.value;

        this.lithologyColumn.set({
            name: name,
            description: description,
            width: parseInt(width) || 0,
            lat: lat,
            lon: lon
        });

        this.lithologyColumn.get('settings').set({
            backgroundColor: bgColor
        });
    };

    LithologyColumnView.prototype.createLithologyGroupMarker = function (evt) {
        if (!this.app.enLithologys) return;
        var lithologyGroupMarker = new LithologyGroupMarker({
            y: evt.offsetY,
            lithologyColumn: this.lithologyColumn
        }, this.app);

        if (lithologyGroupMarker.get('zone') === null) {
            lithologyGroupMarker.destroy();
            return;
        }

        this.lithologyColumn.get('lithologyGroupMarkers').add(lithologyGroupMarker);
    }

    LithologyColumnView.prototype.addLithologyGroupMarker = function (lithologyGroupMarker) {
        var lithologyGroupMarkerView = new LithologyGroupMarkerView(this.app, lithologyGroupMarker);

        var self = this;
        var lithologyGroups = this.lithologyColumn.get('lithologyGroups');
        var lithologyGroupMarkers = this.lithologyColumn.get('lithologyGroupMarkers');

        lithologyGroupMarkers.sort();

        var index = lithologyGroupMarkers.indexOf(lithologyGroupMarker);

        var topMarker, baseMarker;

        if (lithologyGroupMarkers.length > 1) {

            if (index < lithologyGroupMarkers.length - 1) {
                var topMarker = lithologyGroupMarkers.at(index);
                var baseMarker = lithologyGroupMarkers.at(index + 1);

                var lithologyGroup = lithologyGroups.findWhere({
                        top: topMarker,
                        base: baseMarker
                    }) ||
                    new LithologyGroup({
                        top: topMarker,
                        base: baseMarker,
                        lithologyColumn: self.lithologyColumn
                    });

                topMarker.get('lithologyGroups').add(lithologyGroup);
                baseMarker.get('lithologyGroups').add(lithologyGroup);

                baseMarker.set({
                    name: lithologyGroup.get('name') + " Base"
                });

                lithologyGroups.add(lithologyGroup);
            }

            if (index > 0) {
                var topMarker = lithologyGroupMarkers.at(index - 1);
                var baseMarker = lithologyGroupMarkers.at(index);

                var lithologyGroup = lithologyGroups.findWhere({
                        top: topMarker,
                        base: baseMarker
                    }) ||
                    new LithologyGroup({
                        top: topMarker,
                        base: baseMarker,
                        lithologyColumn: self.lithologyColumn
                    });

                topMarker.get('lithologyGroups').add(lithologyGroup);
                baseMarker.get('lithologyGroups').add(lithologyGroup);

                baseMarker.set({
                    name: lithologyGroup.get('name') + " Base"
                });

                lithologyGroups.add(lithologyGroup);
            }
        }

        this.element.attr({
            height: this.app.Paper.height,
        });
    }

    LithologyColumnView.prototype.removeLithology = function (lithologyGroup) {
        var topMarker = lithologyGroup.get('top');
        var baseMarker = lithologyGroup.get('top');
    }

    LithologyColumnView.prototype.addLithologyGroup = function (lithologyGroup) {
        var lithologyGroupView = new LithologyGroupView(this.app, lithologyGroup);
        this.$lithologyGroupsList.append(lithologyGroupView.el);
    }

    LithologyColumnView.prototype.updateLithologyColumns = function () {
        var self = this;
        var stratIndex = this.app.LithologyColumnsCollection.indexOf(this.lithologyColumn);
        this.app.LithologyColumnsCollection.each(function (lithologyColumn, index) {
            if (index > stratIndex) {
                var prevColumn = self.app.LithologyColumnsCollection.at(index - 1);
                var x = prevColumn.get('x') + prevColumn.get('width');
                lithologyColumn.set({
                    x: x
                });
            }
        });
    }

    LithologyColumnView.prototype.showLithologyGroupsList = function () {
        if (this.$lithologyGroupsList.hasClass('hide')) {
            this.$lithologyGroupsList.removeClass('hide');
        } else {
            this.$lithologyGroupsList.addClass('hide');
        }
    }

    LithologyColumnView.prototype.delete = function () {
        _.invoke(this.lithologyColumn.get('lithologyGroups').toArray(), "destroy");

        if (this.element) this.element.remove();
        if (this.headingText) this.headingText.remove();
        if (this.headingBox) this.headingBox.remove();
        this.$el.remove();
        this.remove();
    }

    LithologyColumnView.prototype.destroy = function () {
        this.lithologyColumn.destroy();
    }


    LithologyColumnView.prototype.resizePaper = function () {
        var width = Math.max(this.app.Paper.width, this.lithologyColumn.get('x') + this.lithologyColumn.get('width'));
        this.app.Paper.setSize(width, this.app.Paper.height);
        if (this.app.ruler) {
            this.app.ruler.resize();
        }
    }

    LithologyColumnView.prototype.addOverlay = function () {
        this.app.lithology2dView.polygonsView.createOverlay(this.lithologyColumn);
        this.$addOverlay.parent().addClass('hide');
        this.$finishOverlay.parent().removeClass('hide');
    }

    LithologyColumnView.prototype.editOverlay = function () {
        this.app.lithology2dView.polygonsView.disableAllPolygons();
        this.lithologyColumn.get('polygon').set({
            'draw': true
        });

    }

    LithologyColumnView.prototype.finishOverlay = function () {
        this.app.lithology2dView.polygonsView.disableAllPolygons();
        this.lithologyColumn.get('polygon').set({
            'draw': false
        });
    }

    LithologyColumnView.prototype.updateButtons = function () {
        if (this.lithologyColumn.get('polygon')) {
            if (this.lithologyColumn.get('polygon').get('draw')) {
                this.$overlayTool.addClass('hide');
                this.$finishOverlay.parent().removeClass('hide');
            } else {
                this.$overlayTool.addClass('hide');
                this.$editOverlay.parent().removeClass('hide');
            }
        }
    }

    LithologyColumnView.prototype.deletePolygon = function () {
        this.lithologyColumn.set({
            'polygon': null
        });
        this.$addOverlay.parent().removeClass('hide');
        this.$finishOverlay.parent().addClass('hide');
        this.$editOverlay.parent().addClass('hide');
    }

	LithologyColumnView.prototype.onMouseOver = function() {
		this.$el.addClass('hover');
		this.lithologyColumn.set({
			hover: true,
		});
    }

	LithologyColumnView.prototype.onMouseOut = function() {
		this.$el.removeClass('hover');
		this.lithologyColumn.set({
			hover: false,
		});
    }

	LithologyColumnView.prototype.setHoverStatus = function() {
		if (this.lithologyColumn.get('hover')) {
			this.$el.addClass('hover');
			this.glow  = this.element.glow();
		} else {
			if (this.glow) this.glow.remove();
			this.$el.removeClass('hover');
		}
	}
	/*==========  start dragging  ==========*/
	LithologyColumnView.prototype.dragStart = function(x, y, evt) {
		var self = this;
		this.lithologyColumnIndex = this.app.LithologyColumnsCollection.indexOf(this.lithologyColumn);
        this.lithologyColumnX = this.app.LithologyColumnsCollection.at(this.lithologyColumnIndex).get('x');
        this.curLithologyColumnWidth = this.lithologyColumn.get('width');

        var startIndex = this.lithologyColumnIndex;
        if (Math.abs(this.lithologyColumnX - x) <= 100) {
		    this.app.LithologyColumnsCollection.each(function(lithologyColumn, index) {
                // find the index of previous column
			    if (index == startIndex - 1) {
				    self.prevColumn = self.app.LithologyColumnsCollection.at(index);
                    self.prevColumnWidth = self.prevColumn.get('width');  
			        if (self.glow) 
                        self.glow.remove();
			    }
            });
        } 
    };

	/*==========  while dragging  ==========*/
	LithologyColumnView.prototype.dragMove = function(dx, dy, x, y, evt) {
        if (this.prevColumn) {
            // changing the width of the previous column which will automatically shift all other columns
            this.newWidthForPrevColumn = this.prevColumnWidth + dx;
            this.prevColumn.set('width', this.newWidthForPrevColumn);
			if (this.glow) 
                this.glow.remove();
        } 
        else if (this.lithologyColumnIndex == 0) { // handle first Column
            //this.blockColumn.set('x', dx);
        }
        else if (this.lithologyColumnIndex == this.app.LithologyColumnsCollection.length - 1) { // handle first Column
            var newWidthForCurColumn = this.curLithologyColumnWidth + dx;
            this.lithologyColumn.set('width', newWidthForCurColumn);
        }
	};

	/*==========  end dragging  ==========*/
	LithologyColumnView.prototype.dragEnd = function(x, y, evt) {
        if (this.prevColumn) {
            // updating the width value in the block column width field
            var prevColumnView = this.prevColumn.lithologyColumnView;
            var lithologyColumnWidthField = prevColumnView.$('input[name="lithology-column-width"]')[0];
            lithologyColumnWidthField.setAttribute('value', this.newWidthForPrevColumn); 
            this.prevColumn = null;
        } else if (this.lithologyColumnIndex == 0) {
            //this.blockColumn.set('x', x);
        }
    }

    return LithologyColumnView;
});
