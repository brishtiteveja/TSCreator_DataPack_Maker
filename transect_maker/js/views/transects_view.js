define(["baseView", "transectView", "transects"], function(BaseView, TransectView, Transects) {
	var TransectsView = BaseView.extend({
		el: "#transects-list",
		classname: "TransectsView",
	});

	TransectsView.prototype.template = new EJS({
		url: '/commons/ejs/data_tbl.ejs'
	});

	TransectsView.prototype.initialize = function(app) {
		this.app = app;
		/* initialize the transects views */
		this.transects = this.app.TransectsCollection;

		/* render views */
		this.render();
		/*
			attach the listener to check for changes in the collection.
		*/
		this.listenTo(this.transects, "add", this.addTransect.bind(this));
		this.listenTo(this.transects, "reset", this.resetTransect.bind(this));

	};

	TransectsView.prototype.render = function() {
		this.$el.html(this.template.render({
			name: "Transect"
		}));
		this.$transectsTable = this.$(".data-list");
		this.transects.each(this.addTransect.bind(this));
	};

	TransectsView.prototype.addTransect = function(transect) {
		var transectView = new TransectView(this.app, transect);
		this.$transectsTable.append(transectView.el);
	};

	TransectsView.prototype.resetTransect = function() {
		this.$transectsTable.html('');
		this.transects.each(this.addTransect, this);
		this.app.PointsCollection.updatePoints();
		this.app.TransectTextsCollection.updateTransectTexts();
	};

	return TransectsView;
});