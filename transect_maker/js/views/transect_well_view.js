/*========================================
=            TransectWellView            =
========================================*/

define(["baseView"], function(BaseView) {
	var TransectWellView = BaseView.extend({
		tagName: 'li',
		classname: 'TransectWellView',
		events: {
			'click .toggle': 'toggleWellForm',
			'click .well-data': 'toggleWellForm',
			'click .destroy': 'destroy',
	    	'keypress :input': 'updateWell',
	    	'keyup :input': 'updateWell',
			'mouseover': "onMouseOver",
			'mouseout': "onMouseOut",
		}
	});

	TransectWellView.prototype.template = new EJS({url: '../../../transect_maker/ejs/transect_well.ejs'});

	TransectWellView.prototype.initialize = function(app, transectWell, transectWellsView) {
		this.app = app;
		/* initialize the view with the well instance the wells view */
		this.transectWell = transectWell;
		this.transectWellsView = transectWellsView;

		/* render the well */
		this.render();

		/* listen to the events */
		this.listenTo(this.transectWell, 'change:edit', this.editTransectWell.bind(this));
		this.listenTo(this.transectWell, 'change:x', this.renderWell.bind(this));
		this.listenTo(this.transectWell, 'change:name', this.renderWell.bind(this));
		this.listenTo(this.transectWell, 'change:lat', this.renderWell.bind(this));
		this.listenTo(this.transectWell, 'change:lon', this.renderWell.bind(this));
		this.listenTo(this.transectWell, 'change:hover', this.setHoverStatus.bind(this));
		this.listenTo(this.transectWell, 'destroy', this.delete.bind(this));
	};

	TransectWellView.prototype.render = function() {
		this.$el.html(this.template.render(this.transectWell.toJSON()));

		/* get DOM elements after the render */
		this.$toggle = this.$(".toggle");
		this.$wellForm = this.$(".well-form");
		this.$wellData = this.$(".well-data");
		this.$wellName = this.$('input[name="well-name"]')[0];
		this.$wellLat = this.$('input[name="well-lat"]')[0];
		this.$wellLon = this.$('input[name="well-lon"]')[0];

		/* check edit state */
		this.editTransectWell();

		/* render the well */
		this.renderWell();

		
		this.app.PointsCollection.updatePoints();
		this.app.TransectTextsCollection.updateTransectTexts();
	};

	TransectWellView.prototype.renderWell = function() {
		if (this.element === undefined) {
			this.element = this.app.Canvas.path();
			this.element.attr({
				"stroke-width": 2,
				"stroke": "#900000"
			});

			this.app.WellsSet.push(this.element);

			/* attach listeners to the element */
			this.element.hover(this.onMouseOver.bind(this), this.onMouseOut.bind(this));
			this.element.drag(this.dragMove.bind(this), this.dragStart.bind(this), this.dragEnd.bind(this));
		}
		
		/* render tooltip */
		this.renderTooltip();

		this.element.attr({'path': this.getPath()});
	};

	TransectWellView.prototype.renderTooltip = function() {
		$(this.element.node).qtip({
			content: {
				text: this.transectWell.get('name')
			},
			position: {
				my: 'left bottom', // Position my top left...
				at: 'left middle', // at the bottom right of...
				target: "mouse", // my target 
			}
		});
	};

	TransectWellView.prototype.getPath = function() {
		return "M" + this.transectWell.get('x') + ",0" + 'V' + this.app.Canvas.height;
	};

	TransectWellView.prototype.dragStart = function(x, y, evt) {};

	TransectWellView.prototype.dragMove = function(dx, dy, x, y, evt) {
		this.transectWell.set({
			x: evt.offsetX
		});	
	};

	/*==========  when drag ends update the points and texts  ==========*/
	
	TransectWellView.prototype.dragEnd = function(evt) {
		this.app.PointsCollection.updatePoints();
		this.app.TransectTextsCollection.updateTransectTexts();
	};

	TransectWellView.prototype.onMouseOver = function() {
		this.transectWellsView.undelegateEvents();
		this.transectWell.set({
			hover: true,
		});
	};

	TransectWellView.prototype.onMouseOut = function() {
		this.transectWellsView.delegateEvents();
		this.transectWell.set({
			hover: false,
		});
	};

	TransectWellView.prototype.setHoverStatus = function() {
		if (this.transectWell.get('hover')) {			
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

	TransectWellView.prototype.toggleWellForm = function() {
		this.render();
		this.transectWell.set({
			'edit': !this.transectWell.get('edit')
		});
	};

	TransectWellView.prototype.editTransectWell = function() {
		if (this.transectWell.get('edit')) {
			this.$wellForm.removeClass('hide');
			this.$wellData.addClass('hide');
			this.$toggle.removeClass('hide-data');
			this.$toggle.addClass('show-data');
		} else {
			this.$wellForm.addClass('hide');
			this.$wellData.removeClass('hide');
			this.$toggle.removeClass('show-data');
			this.$toggle.addClass('hide-data');
		}
	};

	TransectWellView.prototype.updateWell = function(evt) {

		if (evt.keyCode == transectApp.ENTER || evt.keyCode == transectApp.ESC) {
			this.toggleWellForm();
		}

		var name = this.$wellName.value;
		var lat = parseFloat(this.$wellLat.value);
		var lon = parseFloat(this.$wellLon.value);
		this.transectWell.set({
			name: name,
			lat: lat,
			lon: lon
		});
	};

	TransectWellView.prototype.delete = function() {
		if (this.element !== undefined) this.element.remove();
		this.$el.remove();
		this.remove();
	}

	TransectWellView.prototype.destroy = function() {
		this.transectWell.destroy();
	}

	return TransectWellView;
});

/*-----  End of TransectWellView  ------*/
