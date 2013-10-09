/*=========================================
=            TransectWellsView            =
=========================================*/

var TransectWellsView = BaseView.extend({
	el: ".container",
	classname: "TransectWellsView",
	events: {
		'dblclick #canvas': 'createWell'
	}
});

TransectWellsView.prototype.wellsListTemplate = new EJS({url: '/html/templates/data_tbl.ejs'});

TransectWellsView.prototype.initialize = function() {
	/* initialize transect wells collection */
	this.transectWells = TransectWellsCollection;
	this.enWells = false;

	/* get necessary dom elements */
	this.$wellsList = this.$('#wells-list');

	/* render the transect well */
	this.render();

	/* initialize listeners */
	this.listenTo(this.transectWells, 'add', this.wellAdded.bind(this));
};

TransectWellsView.prototype.render = function() {
	/* render the wells list */
	this.$wellsList.html(this.wellsListTemplate.render({name: "Reference Wells"}));

	/* get well table dom element */
	this.$wellsTable = this.$("#wells-list .data-list");

	/* render the well */
	this.renderWells();
};

TransectWellsView.prototype.renderWells = function() {
	if (this.set === undefined) {
		this.set = Canvas.set();
	}
	this.transectWells.each(this.addWell.bind(this));
};

TransectWellsView.prototype.addWell = function(well) {
	var transectWellView = new TransectWellView(well, this);
	this.$wellsTable.append(transectWellView.el);
	this.set.push(transectWellView.element);
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
	this.updateTransects();
	this.render();
};

TransectWellsView.prototype.updateTransects = function() {
	var transects = [];
	TransectWellsCollection.each(function(well, index, wells) {
		if (index > 0) {
			transects.push(new Transect({}, wells[index - 1], well));
		}
	});
	TransectsCollection.reset(transects);
};
/*-----  End of TransectWellsView  ------*/
