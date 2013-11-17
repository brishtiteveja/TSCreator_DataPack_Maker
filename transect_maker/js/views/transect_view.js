/*====================================
=            TransectView            =
====================================*/

var TransectView = BaseView.extend({
	tagName: 'tr',
	classname: 'TransectView'
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
	this.$name = this.$("input[name*=transect-name]");
	this.$toggle.click(this.toggleForm.bind(this));
};

TransectView.prototype.toggleForm = function() {
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

/*-----  End of TransectView  ------*/