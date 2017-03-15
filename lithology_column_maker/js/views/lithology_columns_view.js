/*========================================
=            LithologyColumnsView            =
========================================*/

define(["baseView", "lithologyColumnView", "lithologyColumn"], function(BaseView, LithologyColumnView, LithologyColumn) {
	
	var LithologyColumnsView = BaseView.extend({
		el: "#columns-list",
		classname: "LithologyColumns",
	});


	LithologyColumnsView.prototype.template = new EJS({url: '../../commons/ejs/data_tbl.ejs'});

	LithologyColumnsView.prototype.initialize = function(app) {
		this.app = app;
		this.lithologyColumns = this.app.LithologyColumnsCollection;


		this.listenTo(this.lithologyColumns, "add", this.addLithologyColumn.bind(this));
		this.listenToActionEvents();

		this.render();
	}

	LithologyColumnsView.prototype.listenToActionEvents = function() {
		$('a[href="#new-column"]').bind('click', this.createLithologyColumn.bind(this));
	}

	LithologyColumnsView.prototype.render = function() {
		this.$el.html(this.template.render());
		this.$columnsList = this.$(".data-list");
	}

	LithologyColumnsView.prototype.addLithologyColumn = function(lithologyColumn) {
		var lithologyColumnView = new LithologyColumnView(this.app, lithologyColumn);
		this.$columnsList.append(lithologyColumnView.el);
	}

	LithologyColumnsView.prototype.createLithologyColumn = function() {
		var x = 0;
		if (this.lithologyColumns.length > 0) {
			x = this.lithologyColumns.last().get('x') + this.lithologyColumns.last().get('width');
		}
		var name = "Column " + this.lithologyColumns.length;
		this.lithologyColumns.add(new LithologyColumn({x: x, name: name}));
	}

	return LithologyColumnsView;
});


/*-----  End of LithologyColumnsView  ------*/

