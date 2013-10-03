/*========================================
=            TransectWellView            =
========================================*/

var TransectWellView = BaseView.extend({
	tagName: 'tr',
	classname: 'TransectWellView',
	events: {
		'click .toggle': 'toggleWellForm',
		'click a[href*="update-well"]': 'updataWell'
	}
});

TransectWellView.prototype.template = new EJS({url: '/html/templates/transect_well.ejs'});

TransectWellView.prototype.initialize = function(transectWell, transectWellsView) {
	/* initialize the view with the well instance the wells view */
	this.transectWell = transectWell;
	this.transectWellsView = transectWellsView;

	/* render the well */
	this.render();

	/* listen to the events */
	this.listenTo(this.transectWell, 'change:edit', this.editTransectWell.bind(this));
	this.listenTo(this.transectWell, 'change:x', this.render.bind(this));
};

TransectWellView.prototype.render = function() {
	this.$el.html(this.template.render(this.transectWell.toJSON()));

	/* get DOM elements after the render */
	this.$toggle = this.$(".toggle");
	this.$wellForm = this.$(".well-form");
	this.$wellData = this.$(".well-data");

	/* check edit state */
	this.editTransectWell();

	/* render the well */
	this.renderWell();
};

TransectWellView.prototype.renderWell = function() {
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

	/* render tooltip */
	this.renderTooltip();
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
	return "M" + this.transectWell.get('x') + ",0" + 'V' + Canvas.height;
};

TransectWellView.prototype.dragStart = function(x, y, evt) {};

TransectWellView.prototype.dragMove = function(dx, dy, x, y, evt) {
	this.transectWell.set({
		x: evt.offsetX
	});
};

TransectWellView.prototype.dragEnd = function(evt) {};

TransectWellView.prototype.onMouseOver = function() {
	this.transectWellsView.undelegateEvents();
	this.element.attr({
		"stroke-width": 5
	});
};

TransectWellView.prototype.onMouseOut = function() {
	this.transectWellsView.delegateEvents();
	this.element.attr({
		"stroke-width": 2
	});
};

TransectWellView.prototype.toggleWellForm = function() {
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

TransectWellView.prototype.updateWell = function() {
	debugger;
};


/*-----  End of TransectWellView  ------*/
