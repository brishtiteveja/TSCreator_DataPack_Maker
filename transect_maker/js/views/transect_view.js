/*====================================
=            TransectView            =
====================================*/

var TransectView = BaseView.extend({
	tagName: 'li',
	classname: 'TransectView',
	events: {
		'click .toggle': 'toggleTransectForm',
		'click .transect-data': 'toggleTransectForm',
		'keypress :input': 'updateTransect',
		'keyup :input': 'updateTransect',
		'mouseover': "onMouseOver",
		'mouseout': "onMouseOut",
	}
});

TransectView.prototype.template = new EJS({
	url: '/transect_maker/ejs/transect.ejs'
});

TransectView.prototype.initialize = function(transect) {
	this.transect = transect;

	/* list to the changes to edit attribute */
	this.listenTo(this.transect, 'change:edit', this.toggleEditStatus.bind(this));

	/* render the dom element in the settings */
	this.render();
};

TransectView.prototype.render = function() {
	this.$el.html(this.template.render(this.transect.toJSON()));

	// reference the elements of the generated view.
	// 
	this.$transectForm = this.$(".transect-form");
	this.$transectData = this.$(".transect-data");
	this.$destroy = this.$(".destroy");
	this.$toggle = this.$(".toggle");
	this.$update = this.$(".update");
	this.$name = this.$("input[name*=transect-name]")[0];
	this.$description = this.$("textarea[name*=transect-description]")[0];

	this.$toggle.click(this.toggleTransectForm.bind(this));
};

TransectView.prototype.toggleTransectForm = function() {
	this.render();
	this.transect.set({
		'edit': !this.transect.get('edit')
	});
}

TransectView.prototype.toggleEditStatus = function() {
	if (this.transect.get('edit')) {
		this.$transectForm.removeClass('hide');
		this.$transectData.addClass('hide');
		this.$toggle.removeClass('hide-data');
		this.$toggle.addClass('show-data');
	} else {
		this.$transectForm.addClass('hide');
		this.$transectData.removeClass('hide');
		this.$toggle.removeClass('show-data');
		this.$toggle.addClass('hide-data');
	}
}


TransectView.prototype.onMouseOver = function() {
	this.$el.addClass('hover');
};

TransectView.prototype.onMouseOut = function() {
	this.$el.removeClass('hover');
};

TransectView.prototype.updateTransect = function(evt) {

	if (evt.keyCode == 13) {
		this.toggleTransectForm();
	}

	var name = this.$name.value;
	var description = this.$description.value;
	this.transect.set({
		name: name,
		description: description
	});
}

/*-----  End of TransectView  ------*/