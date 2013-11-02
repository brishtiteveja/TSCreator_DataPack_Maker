/*===================================
=            PolygonView            =
===================================*/

var PolygonView = BaseView.extend({
	tagName: "tr",
	classname: "PolygonView",
	events: {
		'click .toggle-polygon': 'togglePolygonForm',
		'click a.polygon-list-tool': 'showList',
		'click .destroy-polygon': 'destroy'
	}
});

PolygonView.prototype.template = new EJS({url: '/transect_maker/ejs/polygon.ejs'});

/*==========  initialize the polygon view.  ==========*/

PolygonView.prototype.initialize = function(polygon) {
	this.polygon = polygon;

	// create raphael sets to store points and lines 
	this.pointsSet = Canvas.set();
	this.linesSet = Canvas.set();

	// render 
	this.render();

	// bind canvas events
	this.listenToActionEvents();

	// listen to the change in edit attribute
	this.listenTo(this.polygon, 'change:edit', this.toggleEditStatus.bind(this));

	/* listen to the changes in the points and re-render the lines. That is 
	the point is moved we reset the lines and the polygon. */
	this.listenTo(this.polygon.points, 'change', this.resetLines.bind(this));

	/* listen to the changes in the collection and render the appropriate view. */
	this.listenTo(this.polygon.points, 'add', this.addPointToPolygon.bind(this));

	/* listen to the event when all the points in the collection are reset  */
	this.listenTo(this.polygon.points, 'reset', this.resetPolygonPoints.bind(this));

	/* listen to the event when a new line is added to the lines collection and
	generate the lineview  */
	this.listenTo(this.polygon.lines, 'add', this.addLineToPolygon.bind(this));

	/* listen to lines and reset the lines */
	this.listenTo(this.polygon.lines, 'reset', this.resetPolygonLines.bind(this));

	/* destroy the view  if the model is  removed from the collection.*/
	this.listenTo(this.polygon, 'destroy', this.delete.bind(this));
};

PolygonView.prototype.render = function() {
	// render the view for the polygon in the settings panel.
	this.$el.html(this.template.render(this.polygon.toJSON()));

	// get the appropriate dom elements from the newly added view
	this.$togglePolygon = this.$(".toggle-polygon");
	this.$polygonForm = this.$(".polygon-form"); 
	this.$polygonData = this.$(".polygon-data");
	this.$polygonName = this.$('input[name="polygon-name"]')[0];
	this.$linesList = this.$('.lines-list');
	this.$pointsList = this.$('.points-list');
}

PolygonView.prototype.listenToActionEvents = function() {
	// add a point when we double click on canvas.
	$("#canvas").bind('dblclick', this.addPoint.bind(this));
}

PolygonView.prototype.addPointToPolygon = function(point) {
	var pointView = new PointView(point);
	this.$pointsList.append(pointView.el);
	this.pointsSet.push(pointView.element);

	/* when ever we ad a new point we reset all the lines */
	if (this.polygon.points.length > 1) {
		this.resetLines();
	}
}

/* Reset the lines, i.e. delete all the lines that are currently in 
polygon and redraw them this give the animated effect of expanding 
this polygon as well as moving a point without breaking the polygon */
PolygonView.prototype.resetLines = function() {	
	var lines = [];
	// create a new list of points for all the points in the polygon.
	this.polygon.points.each(function(point, index, points){
		if (index > 0) {
			lines.push(new Line({}, points[index - 1], point));
			if (index > 1 && index === points.length - 1) {
				lines.push(new Line({}, point, points[0]));
			}
		}
	});

	// destroy the current list of lines.
	_.invoke(this.polygon.lines.toArray(), 'destroy');

	// replace the polygon lines with the new set
	this.polygon.lines.reset(lines);
	this.renderPolygonElement();

	// bring points to front so that we can use them again because if
	// they are in the back we cannot click them
	PointsSet.toFront();
}

/* This function listen to the polygons collection and is
executed when a new line model is added. */
PolygonView.prototype.addLineToPolygon = function(line) {
	var lineView = new LineView(line);
	this.linesSet.push(lineView.element);
	this.$linesList.append(lineView.el);
}

/* this function listens to lines collection resets */
PolygonView.prototype.resetPolygonLines = function() {
	this.polygon.lines.each(this.addLineToPolygon, this);
}

PolygonView.prototype.resetPolygonPoints = function() {
	this.polygon.points.each(this.addPointToPolygon, this);	
}

PolygonView.prototype.addPoint = function(evt) {
	if (!this.polygon.get('edit')) {return;}
	var point = new Point({x: evt.offsetX, y: evt.offsetY});
	this.polygon.points.add(point);
}


PolygonView.prototype.setEditMode = function() {
	this.element.attr({
		'fill': "#759dcd",
		'opacity': 0.5
	});
}

PolygonView.prototype.setFinishedMode = function() {
	this.element.attr({
		'fill': "#FFCC33",
		'opacity': 0.5
	});
}

PolygonView.prototype.toggleEditStatus = function() {
	if (this.element !== undefined) {


		if (this.polygon.get('edit')) {
			this.setEditMode();
			this.$polygonForm.removeClass('hide');
			this.$polygonData.addClass('hide');
			this.$togglePolygon.removeClass('hide-data');
			this.$togglePolygon.addClass('show-data');
		} else {
			this.setFinishedMode();
			this.$polygonForm.addClass('hide');
			this.$polygonData.removeClass('hide');
			this.$togglePolygon.removeClass('show-data');
			this.$togglePolygon.addClass('hide-data');
		}
	}
}

PolygonView.prototype.getConvexHull = function() {
	var hullPoints = [];
	var points = this.polygon.points.toArray();
	points.sort(sortPointX);
	points.sort(sortPointY);
	var hullPoints_size = chainHull_2D(points, points.length, hullPoints);
	_.invoke(this.polygon.points.toArray(), 'destroy');
	this.polygon.points.reset(hullPoints);
}

PolygonView.prototype.getPath = function() {
	var path = 'M';
	this.polygon.points.each(function(point, index, points) {
		if (index > 0) {
			path += ',L'
		}
		path += point.get('x') + ',' + point.get('y');
	});
	return path;
}

PolygonView.prototype.renderPolygonElement = function() {
	if (this.element !== undefined) {
		this.element.remove();
	}
	this.element = Canvas.path(this.getPath());
	this.setEditMode();
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
	this.element.remove();
	this.linesSet.remove();
	this.pointsSet.remove();
	this.remove();
}

PolygonView.prototype.destroy = function() {
	this.polygon.destroy();
}
/*-----  End of PolygonView  ------*/

	