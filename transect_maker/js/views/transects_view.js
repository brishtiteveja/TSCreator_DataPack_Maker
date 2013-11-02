/*=====================================
=            TransectsView            =
=====================================*/

var TransectsView = BaseView.extend({
	el: "#transects-list",
	classname: "TransectsView",
});

TransectsView.prototype.transectsListTemplate = new EJS({url: '/commons/ejs/data_tbl.ejs'});

TransectsView.prototype.initialize = function() {
	/* initialize the transects views */
	this.transects = transectApp.TransectsCollection;
	this.render();
	
	/*
		attach the listener to check for changes in the collection.
	*/
	this.listenTo(this.transects, "add", this.addTransect.bind(this));
	this.listenTo(this.transects, "reset", this.resetTransects.bind(this));
};

TransectsView.prototype.render = function() {
	this.$el.html(this.transectsListTemplate.render({name: "Transect"}));
	this.$transectsTable = this.$(".data-list");
};

TransectsView.prototype.addTransect = function (transect) {
	var transectView = new TransectView(transect);
	this.$transectsTable.append(transectView.el);
};

TransectsView.prototype.resetTransects = function() {
	this.$transectsTable.html('');
	this.transects.each(this.addTransect, this);
};

/*-----  End of TransectsView  ------*/
