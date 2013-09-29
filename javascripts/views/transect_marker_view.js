/*==========================================
=            TransectMarkerView            =
==========================================*/

var TransectMarkerView = BaseView.extend({
	tagName: 'tr',
	classname: "TransectMarkerView",
	events: {
		'click .toggle' : 'toggleMarkerForm',
		'click a[href*="update-marker"]': 'updateMarker'
	}
});

TransectMarkerView.prototype.template = new EJS({url: '/html/templates/transect_marker.ejs'});

TransectMarkerView.prototype.initialize = function(transectMarker, transectMarkersView) {
	/* initialize the the view the the marker instance and the collecting view */
	this.transectMarkersView = transectMarkersView;
	this.transectMarker = transectMarker;

	/* render the marker as well as the settings */
	this.render();

	/* listen to the events */
	this.listenTo(this.transectMarker, 'change:edit', this.editTransectMarker.bind(this));
	this.listenTo(this.transectMarker, 'change:y', this.render.bind(this));
};

TransectMarkerView.prototype.render = function() {
	this.$el.html(this.template.render(this.transectMarker.toJSON()));
	/* get DOM elements after render */
	this.$toggle = this.$(".toggle");
	this.$markerForm = this.$(".marker-form");
	this.$markerData = this.$(".marker-data");
	/* check edit state */
	this.editTransectMarker();

	this.renderMarker();
};

TransectMarkerView.prototype.renderMarker = function() {
	if (this.element === undefined) {
		this.element = Canvas.path();
		this.element.attr({
			"stroke-width": 2,
			"stroke": "#900000"
		});
	}
	this.element.attr({'path': this.getPath()});

	/* attach listeners to the element */
	this.element.hover(this.onMouseOver.bind(this), this.onMouseOut.bind(this));
	this.element.drag(this.dragMove.bind(this), this.dragStart.bind(this), this.dragEnd.bind(this));
};

TransectMarkerView.prototype.getPath = function() {
	return "M0," + this.transectMarker.get('y') + 'H' + Canvas.width;
};

TransectMarkerView.prototype.dragStart = function(x, y, evt) {};

TransectMarkerView.prototype.dragMove = function(dx, dy, x, y, evt) {
	this.transectMarker.set({
		y: evt.offsetY
	});
};

TransectMarkerView.prototype.dragEnd = function(evt) {};

TransectMarkerView.prototype.onMouseOver = function() {
	this.transectMarkersView.undelegateEvents();
	this.element.attr({
		"stroke-width": 5
	});
};

TransectMarkerView.prototype.onMouseOut = function() {
	this.transectMarkersView.delegateEvents();
	this.element.attr({
		"stroke-width": 2
	});
};

TransectMarkerView.prototype.toggleMarkerForm = function() {
	this.transectMarker.set({
		'edit': !this.transectMarker.get('edit')
	});
};

TransectMarkerView.prototype.editTransectMarker = function() {
	if (this.transectMarker.get('edit')) {
		this.$markerForm.removeClass('hide');
		this.$markerData.addClass('hide');
		this.$toggle.removeClass('hide-data');
		this.$toggle.addClass('show-data');
	} else {
		this.$markerForm.addClass('hide');
		this.$markerData.removeClass('hide');
		this.$toggle.removeClass('show-data');
		this.$toggle.addClass('hide-data');
	}
};

TransectMarkerView.prototype.updateMarker = function() {
	debugger;
};
/*-----  End of TransectMarkerView  ------*/

