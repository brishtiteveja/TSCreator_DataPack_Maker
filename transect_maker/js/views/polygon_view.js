define(["baseView", "pointView", "lineView", "point", "points", "line", "lines", "polyK"], function(BaseView, PointView, LineView, Point, Points, Line, Lines, PolyK) {
	var PolygonView = BaseView.extend({
		tagName: "li",
		classname: "PolygonView",
		events: {
			'click .toggle': 'togglePolygonForm',
			'click .toggle-polygon': 'togglePolygonForm',
			'click .polygon-data': 'togglePolygonForm',
			'click a.polygon-list-tool': 'showList',
			'click .destroy': 'destroy',
			'click .to-front': 'toFront',
			'keypress :input': 'updatePolygon',
			'keyup :input': 'updatePolygon',
			'click label.polygon-line-data': 'showPolygonLinesList',
			'click label.polygon-point-data': 'showPolygonPointsList',
			'click label.polygon-pattern-data': 'showPolygonPatternsList',
			'mouseover': "onMouseOver",
			'mouseout': "onMouseOut",
		}
	});

	PolygonView.prototype.template = new EJS({
		url: '/transect_maker/ejs/polygon.ejs'
	});

	/*==========  initialize the polygon view.  ==========*/

	PolygonView.prototype.initialize = function(app, polygon) {
		this.app = app;
		this.polygon = polygon;

		// create raphael sets to store points and lines 
		this.pointsSet = this.app.Paper.set();
		this.linesSet = this.app.Paper.set();

		// render 
		this.render();

		// bind canvas events
		this.listenToActionEvents();

		// listen to the change in edit attribute
		this.listenTo(this.polygon, 'change:edit', this.toggleEditStatus.bind(this));
		this.listenTo(this.polygon, 'change:draw', this.setRenderMode.bind(this));

		// listen to the change in name attribute
		this.listenTo(this.polygon, 'update', this.updatePolygonView.bind(this));
		this.listenTo(this.polygon, 'change:patternName', this.updatePolygonView.bind(this));

		/* listen to the changes in the points and re-render the lines. That is 
		the point is moved we reset the lines and the polygon. */
		this.listenTo(this.polygon.get('points'), 'change', this.renderPolygonElement.bind(this));
		this.listenTo(this.polygon.get('lines'), 'change', this.renderPolygonElement.bind(this));

		/* listen to the changes in the collection and render the appropriate view. */
		this.listenTo(this.polygon.get('points'), 'add', this.addPointToPolygon.bind(this));

		/* listen to the event when all the points in the collection are reset  */
		this.listenTo(this.polygon.get('points'), 'reset', this.resetPolygonPoints.bind(this));

		/* listen to the event when a new line is added to the lines collection and
		generate the lineview  */
		this.listenTo(this.polygon.get('lines'), 'add', this.addLineToPolygon.bind(this));

		/* listen to lines and reset the lines */
		this.listenTo(this.polygon.get('lines'), 'reset', this.resetPolygonLines.bind(this));


		this.listenTo(this.polygon.get('lines'), 'remove', this.updatePolygonLines.bind(this));

		/* destroy the view  if the model is  removed from the collection.*/
		this.listenTo(this.polygon, 'destroy', this.delete.bind(this));

		/* listen to the changes in the  */

	};

	PolygonView.prototype.updatePolygonLines = function() {
		// will keep this function empty for now.
	}

	PolygonView.prototype.updatePolygonView = function(arguments) {
		this.$polygonData.html(this.polygon.get('name') + " → " + this.polygon.get('patternName'));
		this.renderPolygonElement();
		this.setPolygonFill();
		this.toggleEditStatus();
	}

	PolygonView.prototype.render = function() {
		// render the view for the polygon in the settings panel.
		this.$el.html(this.template.render(this.polygon.toJSON()));

		// get the appropriate dom elements from the newly added view
		this.$togglePolygon = this.$(".toggle-polygon");
		this.$polygonForm = this.$(".polygon-form");
		this.$polygonData = this.$(".polygon-data");
		this.$polygonName = this.$('input[name="polygon-name"]')[0];
		this.$polygonDescription = this.$('textarea[name="polygon-description"]')[0];
		this.$linesList = this.$('.lines-list');
		this.$pointsList = this.$('.points-list');
		this.$patternsList = this.$('.patterns-list');
		this.$polygonPattern = this.$('select.polygon-pattern');
		this.$patternImage = this.$('.patterns-image');

		this.$polygonPattern.change(this.updatePolygonPattern.bind(this));

		this.renderPoints();
	}

	PolygonView.prototype.renderPoints = function() {
		this.polygon.get('points').each(this.addPoint.bind(this));
	}

	PolygonView.prototype.showPolygonLinesList = function() {
		if (this.$linesList.hasClass('hide')) {
			this.$linesList.removeClass('hide');
		} else {
			this.$linesList.addClass('hide');
		}
	}

	PolygonView.prototype.showPolygonPointsList = function() {
		if (this.$pointsList.hasClass('hide')) {
			this.$pointsList.removeClass('hide');
		} else {
			this.$pointsList.addClass('hide');
		}
	}

	PolygonView.prototype.showPolygonPatternsList = function() {
		if (this.$patternsList.hasClass('hide')) {
			this.$patternsList.removeClass('hide');
		} else {
			this.$patternsList.addClass('hide');
		}
	}

	PolygonView.prototype.updatePolygonPattern = function() {
		var pattern = this.$('select.polygon-pattern option:selected').val();
		this.polygon.set({
			'patternName': pattern
		});
	}

	PolygonView.prototype.listenToActionEvents = function() {
		// add a point when we double click on canvas.
		$("#canvas").bind('dblclick', this.addPoint.bind(this));
	}

	PolygonView.prototype.addPointToPolygon = function(point) {

		var pointView = new PointView(this.app, point);
		this.$pointsList.append(pointView.el);
		this.pointsSet.push(pointView.element);

		/* when ever we ad a new point we reset all the lines */
		if (this.polygon.get('points').length > 1) {
			this.resetLines();
		}
		this.app.PointsCollection.add(point);
		this.updatePaperDimensions(point);
	}

	PolygonView.prototype.isSimple = function(point) {
		var pointsArray = this.polygon.getPolyKPointsArray();
		return PolyK.IsSimple(pointsArray);
	}

	PolygonView.prototype.updatePaperDimensions = function(point) {
		// this.app.Paper.setSize(Math.max(this.app.Paper.width, point.get('x')), Math.max(this.app.Paper.height, point.get('y') + 100));
	}

	/* Reset the lines, i.e. delete all the lines that are currently in 
	polygon and redraw them this give the animated effect of expanding 
	this polygon as well as moving a point without breaking the polygon */
	PolygonView.prototype.resetLines = function() {
		var lines = [];

		// delete the last line in the old polygon and add a new line
		var point1 = this.polygon.get('points').at(this.polygon.get('points').length - 2);
		var point2 = this.polygon.get('points').first();
		var line = this.app.LinesCollection.findWhere({
			'point1': point1,
			'point2': point2
		}) || this.app.LinesCollection.findWhere({
			'point1': point2,
			'point2': point1
		});

		if (line !== undefined && line.get('polygons').length < 2) {
			line.destroy();
		}

		point1 = this.polygon.get('points').at(this.polygon.get('points').length - 2);
		point2 = this.polygon.get('points').last();
		var line1 = this.app.LinesCollection.findWhere({
			'point1': point1,
			'point2': point2
		}) || this.app.LinesCollection.findWhere({
			'point1': point2,
			'point2': point1
		}) || new Line({}, point1, point2);
		line1.get('polygons').add(this.polygon)

		point1 = this.polygon.get('points').last();
		point2 = this.polygon.get('points').first();
		var line2 = this.app.LinesCollection.findWhere({
			'point1': point1,
			'point2': point2
		}) || this.app.LinesCollection.findWhere({
			'point1': point2,
			'point2': point1
		}) || new Line({}, point1, point2);
		line2.get('polygons').add(this.polygon)

		this.polygon.get('lines').add([line1, line2]);

		this.renderPolygonElement();
		this.setRenderFill();
		this.bringToFront();
	}

	PolygonView.prototype.bringToFront = function() {
		// bring points to front so that we can use them again because if
		// they are in the back we cannot click them
		this.app.PolygonsSet.toFront(); // move all the polygons to front
		this.element.toFront(); // move the current polygon to the top.
		this.app.MarkersSet.toFront();
		this.app.WellsSet.toFront();
		this.app.LinesSet.toFront(); // move the lines to the top
		this.app.TextsSet.toFront();
		this.app.PointsSet.toFront(); // move the points to the top
	}


	/* This function listen to the polygons collection and is
	executed when a new line model is added. */
	PolygonView.prototype.addLineToPolygon = function(line) {
		this.app.LinesCollection.add(line);
		var lineView = new LineView(this.app, line);
		this.linesSet.push(lineView.element);
		this.$linesList.append(lineView.el);
	}

	/* this function listens to lines collection resets */
	PolygonView.prototype.resetPolygonLines = function() {
		this.polygon.get('lines').each(this.addLineToPolygon, this);
	}

	PolygonView.prototype.resetPolygonPoints = function() {
		this.polygon.get('points').each(this.addPointToPolygon, this);
	}

	PolygonView.prototype.addPoint = function(evt) {
		if (this.app.supressDoubleClick) {
			return;
		}
		if (!this.polygon.get('draw')) {
			return;
		}
		var locationX = evt.offsetX;
		var locationY = evt.offsetY;

		var cdts = ViewboxToPaper(this.app, locationX, locationY);
		locationX = cdts.x;
		locationY = cdts.y;

		if (this.polygon.get('points').length > 0 && this.app.Cursor.get('lockH')) {
			locationY = this.polygon.get('points').last().get('y');
		}

		if (this.polygon.get('points').length > 0 && this.app.Cursor.get('lockV')) {
			locationX = this.polygon.get('points').last().get('x');
		}

		var point = this.app.PointsCollection.findWhere({
			x: locationX,
			y: locationY
		}) || new Point({
			x: locationX,
			y: locationY
		}, this.app);
		if (point.get('transect') === null || point.get('zone') === null) {
			point.destroy();
			return;
		}

		this.polygon.get('points').add(point);
	}

	PolygonView.prototype.setRenderFill = function() {
		if (this.element === undefined) return;
		this.element.attr({
			'opacity': 0.5,
			'stroke': 0,
			'fill': transectApp.renderFill
		});
	}

	PolygonView.prototype.setRenderErrorFill = function() {
		if (this.element === undefined) return;
		this.element.attr({
			'opacity': 0.5,
			'stroke': 0,
			'fill': "#FF0000",
		});
	}

	PolygonView.prototype.setPolygonFill = function() {
		if (this.element === undefined) return;
		var pattern = this.polygon.get("patternName");
		var fill = pattern && tscApp.PATTERNS[pattern] ? "url('/pattern_manager/patterns/" + tscApp.PATTERNS[pattern] + "')" : transectApp.polygonFill;
		this.element.attr({
			'opacity': 0.5,
			'stroke': 0,
			'fill': fill
		});
		var url = fill + " no-repeat";
		this.$patternImage.css("background", url);
	}

	PolygonView.prototype.toggleEditStatus = function() {
		if (this.element === undefined) return;

		if (this.polygon.get('edit')) {
			this.$polygonForm.removeClass('hide');
			this.$polygonData.addClass('hide');
			this.$togglePolygon.removeClass('hide-data');
			this.$togglePolygon.addClass('show-data');
		} else {
			this.$polygonForm.addClass('hide');
			this.$polygonData.removeClass('hide');
			this.$togglePolygon.removeClass('show-data');
			this.$togglePolygon.addClass('hide-data');
		}
	}

	PolygonView.prototype.getConvexHull = function() {
		var hullPoints = [];
		var points = this.polygon.get('points').toArray();
		points.sort(sortPointX);
		points.sort(sortPointY);
		var hullPoints_size = chainHull_2D(points, points.length, hullPoints);
		_.invoke(this.polygon.get('points').toArray(), 'destroy');
		this.polygon.get('points').reset(hullPoints);
	}

	PolygonView.prototype.getPath = function() {
		var path = 'M';
		var self = this;
		this.polygon.get('points').each(function(point, index, points) {
			if (index == 0) {
				path += point.get('x') + ',' + point.get('y');
			} else {
				var line = self.polygon.get('lines').findWhere({
					'point1': points[index - 1],
					'point2': point
				});
				if (line !== undefined) {
					path += line.getPath();
				} else {
					line = self.polygon.get('lines').findWhere({
						'point1': point,
						'point2': points[index - 1]
					});
					if (line !== undefined) {
						var tempLine = new Line({}, points[index - 1], point);
						path += tempLine.getPathFromPattern(line.get('pattern'));
						tempLine.destroy();
					}
				}
				if (index > 0 && index === points.length - 1) {
					line = self.polygon.get('lines').findWhere({
						'point1': point,
						'point2': points[0]
					});
					if (line !== undefined) {
						path += line.getPath();
					} else {
						line = self.polygon.get('lines').findWhere({
							'point1': points[0],
							'point2': point
						});
						if (line !== undefined) {
							var tempLine = new Line({}, point, points[0]);
							path += tempLine.getStraightPath();
							tempLine.destroy();
						}
					}
				}
			}
		});
		return path;
	}

	PolygonView.prototype.renderPolygonElement = function() {
		if (this.element === undefined) {
			this.element = this.app.Paper.path();
			this.element.hover(this.onMouseOver.bind(this), this.onMouseOut.bind(this));
			this.app.PolygonsSet.push(this.element);
		}

		this.element.attr({
			path: this.getPath()
		});
		this.renderTooltip();
		this.setRenderMode();
		this.bringToFront();
	}

	PolygonView.prototype.renderTooltip = function() {
		$(this.element.node).qtip({
			content: {
				text: this.polygon.get('name') + "【" + this.polygon.get('patternName') + "】<br>" + (this.polygon.get('description') || "No description yet!")
			},
			position: {
				my: 'bottom left', // Position my top left...
				target: 'mouse', // my target 
			}
		});
	};

	PolygonView.prototype.onMouseOver = function() {
		if (!this.element) return;

		if (this.glow !== undefined) {
			this.glow.remove();
		}
		this.glow = this.element.glow({
			color: transectApp.glowColor,
			width: 40,
			opacity: 1,
		});
		this.glow.show();
		this.$el.addClass('hover');
	}

	PolygonView.prototype.onMouseOut = function() {
		if (!this.element) return;

		if (this.polygon.isSimple()) {
			this.setPolygonFill();
		} else {
			this.setRenderErrorFill();
		}
		if (this.glow !== undefined) {
			this.glow.hide();
		}
		this.$el.removeClass('hover');
	}

	PolygonView.prototype.moveToBottom = function() {
		this.element.toBack();
		if (this.app.transectImageElement !== undefined) {
			this.app.transectImageElement.toBack();
		}
	}

	PolygonView.prototype.togglePolygonForm = function() {
		this.polygon.set({
			'edit': !this.polygon.get('edit')
		});
	}

	PolygonView.prototype.showList = function(evt) {
		this.$('.polygon-settings').removeClass('active');
		var cls = "." + evt.target.getAttribute('href').slice(1) + "-tab";
		this.$(cls).addClass('active');
	};

	PolygonView.prototype.delete = function() {
		if (this.element !== undefined) this.element.remove();
		if (this.linesSet !== undefined) this.linesSet.remove();
		if (this.pointsSet !== undefined) this.pointsSet.remove();
		if (this.glow !== undefined) this.glow.remove();
		this.$el.remove();
		this.remove();
	}

	PolygonView.prototype.destroy = function() {
		this.polygon.destroy();
	}

	PolygonView.prototype.updatePolygon = function(evt) {

		if (evt.keyCode == TimescaleApp.ENTER || evt.keyCode == TimescaleApp.ESC) {
			this.togglePolygonForm();
		}

		this.polygon.set({
			name: this.$polygonName.value,
			description: this.$polygonDescription.value.split("\n").join(" ")
		});

		this.polygon.update();
	}

	PolygonView.prototype.setRenderMode = function() {
		if (this.polygon.get('draw')) {
			this.setRenderFill();
			this.$el.addClass('highlight');
		} else {
			if (this.polygon.isSimple()) {
				this.setPolygonFill();
			} else {
				this.setRenderErrorFill();
			}
			this.$el.removeClass('highlight');
		}
	}

	PolygonView.prototype.toFront = function() {
		if (this.element) this.bringToFront();
	}

	return PolygonView;
});