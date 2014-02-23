/*==========================================
=            TransectMarkerView            =
==========================================*/

define(["baseView"], function(BaseView) {
	var TransectMarkerView = BaseView.extend({
		tagName: 'li',
		classname: "TransectMarkerView",
		events: {
			'click .toggle': 'toggleMarkerForm',
			'click .marker-data': 'toggleMarkerForm',
			'click .destroy': 'destroy',
			'keypress :input': 'updateMarker',
			'keyup :input': 'updateMarker',
			'mouseover': "onMouseOver",
			'mouseout': "onMouseOut",
		}
	});


	/*==========  Template to be used in generation marker in the settings side panel.  ==========*/
	TransectMarkerView.prototype.template = new EJS({url: '/transect_maker/ejs/transect_marker.ejs'});


	/*==========  Initialize the marker  ==========*/
	TransectMarkerView.prototype.initialize = function(app, transectMarker, transectMarkersView) {
		this.app = app;
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
		this.listenTo(this.transectMarker, 'change:hover', this.setHoverStatus.bind(this));
		this.listenTo(this.transectMarker, 'destroy', this.delete.bind(this));
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
	};

	/*==========  render the marker on the canvas  ==========*/
	TransectMarkerView.prototype.renderMarker = function() {
		if (this.element === undefined) {
			this.element = this.app.Canvas.path();
			this.element.attr({
				"stroke-width": 2,
				"stroke": "#900000"
			});
			
			/* attach listeners to the element */
			this.element.hover(this.onMouseOver.bind(this), this.onMouseOut.bind(this));
			this.element.drag(this.dragMove.bind(this), this.dragStart.bind(this), this.dragEnd.bind(this));
			this.element.toFront();
			this.app.MarkersSet.push(this.element);
		}
		this.renderTooltip();
		this.element.attr({'path': this.getPath()});
		this.app.TransectTextsCollection.updateTransectTexts();

		this.resizeCanvas();
	};


	TransectMarkerView.prototype.resizeCanvas = function() {
		var width = this.app.Canvas.width;
		var height = Math.max(this.app.Canvas.height, this.transectMarker.get('y') + 100);
		if (this.app.refCol && this.app.refCol.Canvas) {
			height = Math.max(this.app.refCol.Canvas.height, height);
			this.app.refCol.Canvas.setSize(this.app.refCol.Canvas.width, height);
		}
		this.app.Canvas.setSize(width, height);
	}


	/*==========  render the tooltip for the marker in the canvas  ==========*/
	TransectMarkerView.prototype.renderTooltip = function() {
		var age = this.transectMarker.get('age') === null ? '-' : this.transectMarker.get('age');
		$(this.element.node).qtip({
			content: {
				text: this.transectMarker.get('name') + "【" + age + " myr】"
			},
			position: {
				my: 'bottom left', // Position my top left...
				target: 'mouse', // my target 
			}
		});
	};

	/*==========  get path string for the marker  ==========*/
	TransectMarkerView.prototype.getPath = function() {
		return "M0," + this.transectMarker.get('y') + 'H' + this.app.Canvas.width;
	};

	/*==========  start dragging  ==========*/
	TransectMarkerView.prototype.dragStart = function(x, y, evt) {
		var markers = this.app.TransectMarkersCollection;
		var index = markers.indexOf(this.transectMarker);
		this.prevMarker = markers.at(index - 1);
		this.nextMarker = markers.at(index + 1);
	};

	/*==========  while dragging  ==========*/
	TransectMarkerView.prototype.dragMove = function(dx, dy, x, y, evt) {

		if (this.prevMarker && this.nextMarker && (this.prevMarker.get('y') + 2 > evt.offsetY || evt.offsetY > this.nextMarker.get('y') - 2)) {
			return;
		}
		
		if (!this.prevMarker && this.nextMarker && evt.offsetY > this.nextMarker.get('y') - 2) {
			return;
		}

		if (this.prevMarker && !this.nextMarker && this.prevMarker.get('y') + 2 > evt.offsetY) {
			return;
		}

		this.transectMarker.set({
			y: evt.offsetY
		});
	};

	/*==========  when dragging is completed update the points and texts relative locations ==========*/
	TransectMarkerView.prototype.dragEnd = function(evt) {
		this.app.PointsCollection.updatePoints();
		this.app.TransectTextsCollection.updateTransectTexts();
	};

	TransectMarkerView.prototype.onMouseOver = function() {
		this.transectMarkersView.undelegateEvents();
		this.$el.addClass('hover');
		this.transectMarker.set({
			hover: true,
		});
	};

	TransectMarkerView.prototype.onMouseOut = function() {
		this.transectMarkersView.delegateEvents();
		this.$el.removeClass('hover');
		this.transectMarker.set({
			hover: false,
		});
	};

	TransectMarkerView.prototype.setHoverStatus = function() {
		if (this.transectMarker.get('hover')) {			
			this.element.attr({
				"stroke-width": 5
			});

			this.$el.addClass('hover');
		} else {
			this.element.attr({
				"stroke-width": 2
			});

			this.$el.removeClass('hover');
		}
	}

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
		
		if (evt.keyCode == TimescaleApp.ENTER || evt.keyCode == TimescaleApp.ESC) {
			this.toggleMarkerForm();
		}

		var name = this.$markerName.value;
		var age = parseFloat(this.$markerAge.value) || 0;
		this.transectMarker.set({
			name: name,
			age: age
		});
	};

	TransectMarkerView.prototype.delete = function() {
		if (this.element !== undefined) this.element.remove();
		this.$el.remove();
		this.remove();
	}

	TransectMarkerView.prototype.destroy = function() {
		var zone1 = this.app.ZonesCollection.findWhere({topMarker: this.transectMarker});
		var zone2 = this.app.ZonesCollection.findWhere({baseMarker: this.transectMarker});
		this.transectMarker.destroy();
		if (zone1) zone1.destroy();
		if (zone2) zone2.destroy();
	}

	return TransectMarkerView;
});
/*-----  End of TransectMarkerView  ------*/

