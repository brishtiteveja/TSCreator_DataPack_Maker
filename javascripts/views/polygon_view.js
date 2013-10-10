/*===================================
=            PolygonView            =
===================================*/

var PolygonView = BaseView.extend({
	tagName: "tr",
	classname: "PolygonView",
	events: {
		'click .toggle': 'togglePolygonForm',
	}
});

PolygonView.prototype.template = new EJS({url: '/html/templates/polygon.ejs'});

/*==========  initialize the polygon view.  ==========*/

PolygonView.prototype.initialize = function(polygon) {
	this.polygon = polygon;
	// Set current polygon
	CurrentPolygonView = this;

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
};

PolygonView.prototype.render = function() {
	this.$el.html(this.template.render(this.polygon.toJSON()));
	this.$toggle = this.$(".toggle");
	this.$polygonForm = this.$(".polygon-form");
	this.$polygonData = this.$(".polygon-data");
	this.$polygonName = this.$('input[name="polygon-name"]')[0];
}

PolygonView.prototype.listenToActionEvents = function() {
	// add a point when we double click on canvas.
	$("#canvas").bind('dblclick', this.addPoint.bind(this));
}

PolygonView.prototype.addPointToPolygon = function(point) {
	var pointView = new PointView(point);
	this.pointsSet.push(pointView.element);
}

PolygonView.prototype.resetLines = function() {	
	var lines = [];
	this.polygon.points.each(function(point, index, points){
		if (index > 0) {
			lines.push(new Line({}, points[index - 1], point));
			if (index === points.length - 1) {
				lines.push(new Line({}, point, points[0]));
			}
		}
	});
	_.invoke(this.polygon.lines.toArray(), 'destroy');
	this.polygon.lines.reset(lines);
	this.polygon.lines.each(this.pushLineToSet.bind(this));
	this.renderPolygonElement();
	PointsSet.toFront();
}

PolygonView.prototype.pushLineToSet = function(line) {
	this.linesSet.push(line.element);
}

PolygonView.prototype.addLineToPolygon = function(line) {
	var lineView = new LineView(line);
}

PolygonView.prototype.resetPolygonLines = function() {
	this.polygon.lines.each(this.addLineToPolygon, this);
}

PolygonView.prototype.resetPolygonPoints = function() {
	this.polygon.points.each(this.addPointToPolygon, this);	
}

PolygonView.prototype.addPoint = function(evt) {
	if (!this.polygon.get('edit')) {return;}
	var point = new Point({x: evt.offsetX, y: evt.offsetY});
	this.addNewPoint(point);
}

PolygonView.prototype.addNewPoint = function(point) {
	this.polygon.points.add(point);
	// this.getConvexHull();
	this.resetLines();
}

PolygonView.prototype.toggleEditStatus = function() {
	if (this.element !== undefined) {
		if (!this.polygon.get('edit')) {
			this.element.attr({
				'fill': "#FFCC33",
				'opacity': 0.5
			});
			this.$polygonForm.addClass('hide');
			this.$polygonData.removeClass('hide');
			this.$toggle.removeClass('show-data');
			this.$toggle.addClass('hide-data');

		} else {
			this.element.attr({
				'fill': "#759dcd",
				'opacity': 0.5
			});

			this.$polygonForm.removeClass('hide');
			this.$polygonData.addClass('hide');
			this.$toggle.removeClass('hide-data');
			this.$toggle.addClass('show-data');
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
	this.toggleEditStatus();
}

PolygonView.prototype.togglePolygonForm = function() {
	this.polygon.set({
		'edit': !this.polygon.get('edit')
	});
}


/*-----  End of PolygonView  ------*/

	