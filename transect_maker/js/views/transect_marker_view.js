/*==========================================
=            TransectMarkerView            =
==========================================*/

var TransectMarkerView = BaseView.extend({
	tagName: 'li',
	classname: "TransectMarkerView",
	events: {
		'click .toggle': 'toggleMarkerForm',
		'click .marker-data': 'toggleMarkerForm',
		'keypress :input': 'updateMarker',
		'keyup :input': 'updateMarker',
		'mouseover': "onMouseOver",
		'mouseout': "onMouseOut",
	}
});


/*==========  Template to be used in generation marker in the settings side panel.  ==========*/
TransectMarkerView.prototype.template = new EJS({url: '../../../transect_maker/ejs/transect_marker.ejs'});


/*==========  Initialize the marker  ==========*/
TransectMarkerView.prototype.initialize = function(transectMarker, transectMarkersView) {
	/* initialize the the view the the marker instance and the collecting view */
	this.transectMarkersView = transectMarkersView;
	this.transectMarker = transectMarker;

	/* render the marker as well as the settings */
	this.render();

	/* listen to the events */
	this.listenTo(this.transectMarker, 'change:edit', this.editTransectMarker.bind(this));
	this.listenTo(this.transectMarker, 'change:y', this.renderMarker.bind(this));
	this.listenTo(this.transectMarker, 'change:age', this.renderMarker.bind(this));
	this.listenTo(this.transectMarker, 'change:name', this.renderMarker.bind(this));
};

/*==========  render the trasect  ==========*/
TransectMarkerView.prototype.render = function() {
	this.$el.html(this.template.render(this.transectMarker.toJSON()));
	/* get DOM elements after render */
	this.$toggle = this.$(".toggle");
	this.$markerForm = this.$(".marker-form");
	this.$markerData = this.$(".marker-data");
	this.$markerName = this.$('input[name="marker-name"]')[0];
	this.$markerAge = this.$('input[name="marker-age"]')[0];

	/* check edit state */
	this.editTransectMarker();

	this.renderMarker();
	return this;
};

/*==========  render the marker on the canvas  ==========*/
TransectMarkerView.prototype.renderMarker = function() {
	if (this.element === undefined) {
		this.element = transectApp.Canvas.path();
		this.element.attr({
			"stroke-width": 2,
			"stroke": "#900000"
		});
		
		/* attach listeners to the element */
		this.element.hover(this.onMouseOver.bind(this), this.onMouseOut.bind(this));
		this.element.drag(this.dragMove.bind(this), this.dragStart.bind(this), this.dragEnd.bind(this));
		this.renderTooltip();
	}
	this.element.attr({'path': this.getPath()});
};

/*==========  render the tooltip for the marker in the canvas  ==========*/
TransectMarkerView.prototype.renderTooltip = function() {
	$(this.element.node).qtip({
		content: {
			text: this.transectMarker.get('name') + "【" + (this.transectMarker.get('age') || '-') + " myr】"
		},
		position: {
			my: 'bottom left', // Position my top left...
			target: 'mouse', // my target 
		}
	});
};

/*==========  get path string for the marker  ==========*/
TransectMarkerView.prototype.getPath = function() {
	return "M0," + this.transectMarker.get('y') + 'H' + transectApp.Canvas.width;
};

/*==========  start dragging  ==========*/
TransectMarkerView.prototype.dragStart = function(x, y, evt) {};

/*==========  while dragging  ==========*/
TransectMarkerView.prototype.dragMove = function(dx, dy, x, y, evt) {
	if (transectApp.PointsCollection.updatePoints()) {
		this.transectMarker.set({
			y: evt.offsetY
		});
	}
};

/*==========  when dragging is completed  ==========*/
TransectMarkerView.prototype.dragEnd = function(evt) {};

TransectMarkerView.prototype.onMouseOver = function() {
	this.transectMarkersView.undelegateEvents();
	this.element.attr({
		"stroke-width": 5
	});
	this.$el.addClass('hover');
};

TransectMarkerView.prototype.onMouseOut = function() {
	this.transectMarkersView.delegateEvents();
	this.element.attr({
		"stroke-width": 2
	});
	this.$el.removeClass('hover');
};

TransectMarkerView.prototype.toggleMarkerForm = function() {
	this.render();
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

TransectMarkerView.prototype.updateMarker = function(evt) {
	
	if (evt.keyCode == 13) {
		this.toggleMarkerForm();
	}

	var name = this.$markerName.value;
	var age = parseFloat(this.$markerAge.value) || 0;
	this.transectMarker.set({
		name: name,
		age: age
	});
};

/*-----  End of TransectMarkerView  ------*/

