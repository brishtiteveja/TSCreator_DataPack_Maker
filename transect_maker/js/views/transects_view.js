/*=====================================
=            TransectsView            =
=====================================*/

var TransectsView = BaseView.extend({
	el: "#transects-list",
	classname: "TransectsView",
});

TransectsView.prototype.template = new EJS({url: '../../../commons/ejs/data_tbl.ejs'});

TransectsView.prototype.initialize = function() {
	/* initialize the transects views */
	this.transects = transectApp.TransectsCollection;
	
	/*
		attach the listener to check for changes in the collection.
	*/
	this.listenTo(this.transects, "change", this.render.bind(this));
	this.listenTo(this.transects, "reset", this.render.bind(this));

	/* render views */	
	this.render();
};

TransectsView.prototype.render = function() {
	this.$el.html(this.template.render({name: "Transect"}));
	this.$transectsTable = this.$(".data-list");
	this.transects.each(this.addTransect.bind(this));
};


TransectsView.prototype.addTransect = function (transect) {
	var transectView = new TransectView(transect);
	this.$transectsTable.append(transectView.el);
};


/*-----  End of TransectsView  ------*/
