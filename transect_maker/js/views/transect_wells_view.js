/*=========================================
=            TransectWellsView            =
=========================================*/

define(["baseView", "transectWellView", "transectWell", "transect"], function(BaseView, TransectWellView, TransectWell, Transect) {
	var TransectWellsView = BaseView.extend({
		el: "#wells-list",
		classname: "TransectWellsView"
	});

	TransectWellsView.prototype.template = new EJS({url: '../../../commons/ejs/data_tbl.ejs'});

	TransectWellsView.prototype.initialize = function(app) {
		this.app = app;
		/* initialize transect wells collection */
		this.transects = this.app.TransectsCollection;
		this.transectWells = this.app.TransectWellsCollection;
		this.enWells = false;

		/* render the transect well */
		this.render();

		this.listenToActionEvents();

		/* initialize listeners */
		this.listenTo(this.transectWells, 'add', this.addWell.bind(this));
		this.listenTo(this.transectWells, 'remove', this.render.bind(this));
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
		this.transectWells.each(this.addWell.bind(this));
	};

	TransectWellsView.prototype.addWell = function(well) {
		var transectWellView = new TransectWellView(this.app, well, this);
		this.$wellsTable.append(transectWellView.el);
		this.updateTransects();
	};

	TransectWellsView.prototype.toggleWells = function(evt) {
		if ($("a[href='#add-well']").parent().hasClass('active')) {
			$("a[href='#add-well']").parent().removeClass('active');
			this.enWells = false;
		} else {
			$("a[href='#add-well']").parent().addClass('active');
			this.enWells = true;
		}
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
		var self = this;
		var transectsToDestroy = [];
		this.transectWells.each(function(well, index, wells) {
			if (index > 0) {
				var transect = self.transects.findWhere({wellLeft: wells[index - 1], wellRight: well}) || new Transect({name: "Transect " + index}, wells[index - 1], well, self.app);
				self.transects.add(transect);

				if (index < self.transectWells.length - 1) {
					transect = self.transects.findWhere({wellLeft: wells[index - 1], wellRight: wells[index + 1]});
					if (transect) {
						transectsToDestroy.push(transect);
					}
				}
			}
		});
		_.invoke(transectsToDestroy, "destroy");
	};

	return TransectWellsView;
});

/*-----  End of TransectWellsView  ------*/
