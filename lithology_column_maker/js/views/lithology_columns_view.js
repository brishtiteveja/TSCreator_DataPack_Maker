/*========================================
=            LithologyColumnsView            =
========================================*/

define(["baseView", "lithologyColumnView", "lithologyColumn"], function(BaseView, LithologyColumnView, LithologyColumn) {
	
	var LithologyColumnsView = BaseView.extend({
		el: "#columns-list",
		classname: "LithologyColumns",
		events: {
            'change input[name="project-name"]': 'updateProjectName',
		}
	});


	LithologyColumnsView.prototype.template = new EJS({url: '../../lithology_column_maker/ejs/lithology_columns.ejs'});

	LithologyColumnsView.prototype.initialize = function(app) {
		this.app = app;
		this.lithologyColumns = this.app.LithologyColumnsCollection;

		this.app.projectName = app.projectName;

		this.listenTo(this.lithologyColumns, "add", this.addLithologyColumn.bind(this));
		this.listenToActionEvents();

		this.render();
	}

	LithologyColumnsView.prototype.listenToActionEvents = function() {
		$('a[href="#new-column"]').bind('click', this.createLithologyColumn.bind(this));
	}

	LithologyColumnsView.prototype.render = function() {
		this.$el.html(this.template.render(this.app));
		this.$columnsList = this.$(".data-list");
		this.$projectName = this.$('input[name="project-name"]');
	}

	LithologyColumnsView.prototype.addLithologyColumn = function(lithologyColumn) {
		var lithologyColumnView = new LithologyColumnView(this.app, lithologyColumn);
		this.$columnsList.append(lithologyColumnView.el);

		// Load project Name if project name is provided in the json project file 
		if (this.app.projectName != null && this.$projectName[0].value == "") {
			this.$projectName.val(this.app.projectName);
		}
	}

	LithologyColumnsView.prototype.createLithologyColumn = function() {
		var x = 0;
		if (this.lithologyColumns.length > 0) {
			x = this.lithologyColumns.last().get('x') + this.lithologyColumns.last().get('width');
		}
		var name = "Column " + this.lithologyColumns.length;
		this.lithologyColumns.add(new LithologyColumn({x: x, name: name}));
	}
	
	LithologyColumnsView.prototype.updateProjectName = function(lithologyColumn) {
		this.projectName = this.$projectName[0].value;
		this.app.projectName = this.projectName;
	}

	LithologyColumnsView.prototype.loadProjectName = function() {
		console.log(this.app.projectName);
	}

	return LithologyColumnsView;
});


/*-----  End of LithologyColumnsView  ------*/

