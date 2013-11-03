/*=========================================
=            TransectWellsView            =
=========================================*/

var TransectWellsView = BaseView.extend({
	el: "#wells-list",
	classname: "TransectWellsView"
});

TransectWellsView.prototype.template = new EJS({url: '/commons/ejs/data_tbl.ejs'});

TransectWellsView.prototype.initialize = function() {
	/* initialize transect wells collection */
	this.transectWells = transectApp.TransectWellsCollection;
	this.enWells = false;

	/* render the transect well */
	this.render();

	this.listenToActionEvents();

	/* initialize listeners */
	this.listenTo(this.transectWells, 'add', this.addWell.bind(this));
};

TransectWellsView.prototype.render = function() {
	/* render the wells list */
	this.$el.html(this.template.render({name: "Reference Wells"}));

	/* get well table dom element */
	this.$wellsTable = this.$(".data-list");

	/* render the well */
	this.renderWells();
};

TransectWellsView.prototype.listenToActionEvents = function() {
	$("#canvas").bind('dblclick', this.createWell.bind(this));
}

TransectWellsView.prototype.renderWells = function() {
	if (this.set === undefined) {
		this.set = transectApp.Canvas.set();
	}
	this.transectWells.each(this.addWell.bind(this));
};

TransectWellsView.prototype.addWell = function(well) {
	var transectWellView = new TransectWellView(well, this);
	this.$wellsTable.append(transectWellView.el);
	this.set.push(transectWellView.element);
	this.updateTransects();
};

TransectWellsView.prototype.toggleWells = function(evt) {
	this.enWells = !this.enWells;
};

TransectWellsView.prototype.createWell = function(evt) {
	if (this.enWells) {
		this.transectWells.add(new TransectWell({x: evt.offsetX}));	
	}
};

TransectWellsView.prototype.wellAdded = function() {
	this.render();
};

TransectWellsView.prototype.updateTransects = function() {
	var transects = [];
	this.transectWells.each(function(well, index, wells) {
		if (index > 0) {
			transects.push(new Transect({name: "Transect " + index}, wells[index - 1], well));
		}
	});
	transectApp.TransectsCollection.reset(transects);
};
/*-----  End of TransectWellsView  ------*/
