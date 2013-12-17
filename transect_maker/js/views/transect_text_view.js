/*========================================
=            TransectTextView            =
========================================*/

var TransectTextView = BaseView.extend({
	tagName: 'li',
	classname: "TransectTextView",
	events: {
		'click .toggle': 'toggleTextForm',
		'click .text-data': 'toggleTextForm',
		'keypress :input': 'updateText',
		'keyup :input': 'updateText',
		'mouseover': "onMouseOver",
		'mouseout': "onMouseOut",
	}
});

/* template for transect text */
TransectTextView.prototype.template = new EJS({url: '/transect_maker/ejs/transect_text.ejs'});

TransectTextView.prototype.initialize = function(transectText, transectTextsView) {
	this.transectTextsView = transectTextsView;
	this.transectText = transectText;
	this.render();


	this.listenTo(this.transectText, 'change:x', this.renderTransectText.bind(this));
	this.listenTo(this.transectText, 'change:y', this.renderTransectText.bind(this));
	this.listenTo(this.transectText, 'change:edit', this.editTransectText.bind(this));
	this.listenTo(this.transectText, 'change:text', this.renderTransectText.bind(this));
}

TransectTextView.prototype.render = function() {
	this.$el.html(this.template.render(this.transectText.toJSON()));

	/* get DOM elements after render */
	this.$toggle = this.$(".toggle");
	this.$textForm = this.$(".text-form");
	this.$textData = this.$(".text-data");
	this.$textText = this.$('input[name="text-name"]')[0];

	/* check edit state */
	this.editTransectText();


	this.renderTransectText();
	return this;
}

TransectTextView.prototype.renderTransectText = function() {
	if (this.element === undefined || this.boundingBox === undefined) {
		this.element = transectApp.Canvas.text();
		this.boundingBox = transectApp.Canvas.rect();
		this.element.attr({
			"font-size": 16,
			"stroke-width": 1
		});
		this.boundingBox.hover(this.onMouseOver.bind(this), this.onMouseOut.bind(this));
		this.boundingBox.drag(this.dragMove.bind(this), this.dragStart.bind(this), this.dragEnd.bind(this));
	}

	this.element.attr({
		"text": this.transectText.get('text'),
		"x": this.transectText.get('x'),
		"y": this.transectText.get('y'),
	});

	this.boundingBox.attr({
		"width": this.element.getBBox().width,
		"height": this.element.getBBox().height,
		"x": this.element.getBBox().x,
		"y": this.element.getBBox().y,
		"fill": "#f1f1f1",
		"fill-opacity": 0.1,
		"stroke": "#000",
		"stroke-width": 2,
		"r": "2px"
	});
}

/*==========  start dragging  ==========*/
TransectTextView.prototype.dragStart = function(x, y, evt) {};


/*==========  while dragging  ==========*/
TransectTextView.prototype.dragMove = function(dx, dy, x, y, evt) {
	this.transectText.set({
		x: evt.offsetX,	
		y: evt.offsetY,
	});
};

/*==========  when dragging is completed  ==========*/
TransectTextView.prototype.dragEnd = function(evt) {};

TransectTextView.prototype.onMouseOver = function() {
	this.transectTextsView.undelegateEvents();
	this.element.attr({
		"stroke": "#ff0000"
	});
	this.boundingBox.attr({
		"stroke": "#ff0000"
	});
	this.$el.addClass('hover');
};

TransectTextView.prototype.onMouseOut = function() {
	this.transectTextsView.delegateEvents();
	this.element.attr({
		"stroke": "#000"
	});
	this.boundingBox.attr({
		"stroke": "#000"
	});
	this.$el.removeClass('hover');
};


TransectTextView.prototype.toggleTextForm = function() {
	this.render();
	this.transectText.set({
		'edit': !this.transectText.get('edit')
	});
};

TransectTextView.prototype.editTransectText = function() {
	if (this.transectText.get('edit')) {
		this.$textForm.removeClass('hide');
		this.$textData.addClass('hide');
		this.$toggle.removeClass('hide-data');
		this.$toggle.addClass('show-data');
	} else {
		this.$textForm.addClass('hide');
		this.$textData.removeClass('hide');
		this.$toggle.removeClass('show-data');
		this.$toggle.addClass('hide-data');
	}
};

TransectTextView.prototype.updateText = function(evt) {
	
	if (evt.keyCode == 13) {
		this.toggleTextForm();
	}

	var text = this.$textText.value;
	this.transectText.set({
		text: text,
	});
};


/*-----  End of TransectTextView  ------*/
