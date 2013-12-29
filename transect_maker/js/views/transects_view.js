/*=====================================
=            TransectsView            =
=====================================*/

define(["baseView", "transectView", "transects"], function(BaseView, TransectView, Transects) {
	var TransectsView = BaseView.extend({
		el: "#transects-list",
		classname: "TransectsView",
	});

	TransectsView.prototype.template = new EJS({url: '/commons/ejs/data_tbl.ejs'});

	TransectsView.prototype.initialize = function() {
		/* initialize the transects views */
		this.transects = transectApp.TransectsCollection;

		/* render views */	
		this.render();	
		/*
			attach the listener to check for changes in the collection.
		*/
		this.listenTo(this.transects, "add", this.addTransect.bind(this));
		this.listenTo(this.transects, "reset", this.render.bind(this));

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

	TransectsView.prototype.resetTransect = function () {
		this.$transectsTable('');
		this.transects.each(this.addTransect, this);
	};

	return TransectsView;
});

/*-----  End of TransectsView  ------*/
