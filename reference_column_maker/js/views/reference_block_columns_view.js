/*========================================
=            ReferenceBlockColumnsView            =
========================================*/

define(["baseView", "referenceBlockColumnView", "referenceBlockColumn"], function(BaseView, ReferenceBlockColumnView, ReferenceBlockColumn) {
	
	var ReferenceBlockColumnsView = BaseView.extend({
		el: "#columns-list",
		classname: "ReferenceBlockColumns",
	});


	ReferenceBlockColumnsView.prototype.template = new EJS({url: '/commons/ejs/data_tbl.ejs'});

	ReferenceBlockColumnsView.prototype.initialize = function(app) {
		this.app = app;
		this.referenceBlockColumns = this.app.ReferenceBlockColumnsCollection;


		this.listenTo(this.referenceBlockColumns, "add", this.ReferenceaddBlockColumn.bind(this));
		this.listenToActionEvents();

		this.render();
	}

	ReferenceBlockColumnsView.prototype.listenToActionEvents = function() {
		$('a[href="#new-column"').bind('click', this.ReferencecreateBlockColumn.bind(this));
	}

	ReferenceBlockColumnsView.prototype.render = function() {
		this.$el.html(this.template.render());
		this.$columnsList = this.$(".data-list");
	}

	ReferenceBlockColumnsView.prototype.ReferenceaddBlockColumn = function(referenceBlockColumn) {
		var referenceBlockColumnView = new ReferenceBlockColumnView(this.app, referenceBlockColumn);
		this.$columnsList.append(referenceBlockColumnView.el);
	}

	ReferenceBlockColumnsView.prototype.ReferencecreateBlockColumn = function() {
		var x = 0;
		if (this.referenceBlockColumns.length > 0) {
			x = this.referenceBlockColumns.last().get('x') + this.referenceBlockColumns.last().get('width');
		}
		var name = "Column " + this.referenceBlockColumns.length;
		this.referenceBlockColumns.add(new ReferenceBlockColumn({x: x, name: name}));
	}

	return ReferenceBlockColumnsView;
});


/*-----  End of ReferenceBlockColumnsView  ------*/

