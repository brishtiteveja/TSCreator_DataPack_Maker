
/*========================================
=            LithologyColumnView            =
========================================*/

define(["baseView", "lithologyView", "lithologyMarkerView", "lithology", "lithologyMarker"], function(BaseView, LithologyView, LithologyMarkerView, Lithology, LithologyMarker) {

	var LithologyColumnView = BaseView.extend({
		tagName: "li",
		classname: "LithologyColumnView",
		events: {
			'click .toggle': 'toggleLithologyColumnForm',
			'click .lithology-column-data': 'toggleLithologyColumnForm',
			'click .destroy': 'destroy',
			'click label.lithology-column-lithologys-data': 'showLithologysList',
			'keypress :input': 'updateLithologyColumn',
			'keyup :input': 'updateLithologyColumn',
			'change input[name="lithology-column-bg-color"]': 'updateLithologyColumn',
			'mouseover': "onMouseOver",
			'mouseout': "onMouseOut",
		}
	});

	LithologyColumnView.prototype.template = new EJS({url: '/lithology_column_maker/ejs/lithology_column.ejs'});

	LithologyColumnView.prototype.initialize = function(app, lithologyColumn) {	
		this.app = app;
		this.lithologyColumn = lithologyColumn;

		this.render();

		this.listenTo(this.lithologyColumn, 'change:edit', this.editLithologyColumn.bind(this));
		this.listenTo(this.lithologyColumn, 'change', this.renderLithologyColumn.bind(this));
		this.listenTo(this.lithologyColumn.get('settings'), 'change', this.renderLithologyColumn.bind(this));
		this.listenTo(this.lithologyColumn.get('lithologyMarkers'), 'add', this.addLithologyMarker.bind(this));
		this.listenTo(this.lithologyColumn.get('lithologys'), 'remove', this.removeLithology.bind(this));
		this.listenTo(this.lithologyColumn.get('lithologys'), 'add', this.addLithology.bind(this));
		this.listenTo(this.lithologyColumn, 'destroy', this.delete.bind(this));
	};

	LithologyColumnView.prototype.render = function() {
		this.$el.html(this.template.render(this.lithologyColumn.toJSON()));

		/* get DOM elements after render */
		this.$toggle = this.$(".toggle");
		this.$lithologyColumnForm = this.$(".lithology-column-form");
		this.$lithologyColumnData = this.$(".lithology-column-data");
		this.$lithologyColumnName = this.$('input[name="lithology-column-name"]')[0];
		this.$lithologyColumnWidth = this.$('input[name="lithology-column-width"]')[0];
		this.$lithologyColumnBgColor = this.$('input[name="lithology-column-bg-color"]')[0];
		this.$lithologyColumnDescription = this.$('textarea[name="lithology-column-description"]')[0];
		this.$lithologysList = this.$('.lithologys-list');

		this.renderLithologyColumn();
		// this.renderLithologys();
	}

	LithologyColumnView.prototype.renderLithologyColumn = function() {
		if (this.element === undefined) {
			this.element = this.app.Canvas.rect(this.lithologyColumn.get('x'), 0, this.lithologyColumn.get('width'), this.app.Canvas.height);

			/* attach listeners to the element */
			this.element.dblclick(this.createLithologyMarker.bind(this));

			this.app.MarkersSet.toFront();
		}

		this.element.attr({
			x: this.lithologyColumn.get('x'),
			width: this.lithologyColumn.get('width'),
			fill: this.lithologyColumn.get('settings').get('backgroundColor')
		});

		this.updateLithologyColumns();
	}

	LithologyColumnView.prototype.resetLithologys = function() {
		this.$lithologysList.html('');
		this.lithologyColumn.get('lithologys').each(this.addLithology.bind(this));
	}

	LithologyColumnView.prototype.renderLithologys = function() {
		this.lithologyColumn.get('lithologys').each(this.addLithologyMarker.bind(this));
	}

	LithologyColumnView.prototype.toggleLithologyColumnForm = function() {
		this.renderLithologyColumn();
		this.lithologyColumn.set({
			'edit': !this.lithologyColumn.get('edit')
		});
	}

	LithologyColumnView.prototype.editLithologyColumn = function() {
		if (this.lithologyColumn.get('edit')) {
			this.$lithologyColumnForm.removeClass('hide');
			this.$lithologyColumnData.addClass('hide');
			this.$toggle.removeClass('hide-data');
			this.$toggle.addClass('show-data');
		} else {
			this.$lithologyColumnForm.addClass('hide');
			this.$lithologyColumnData.removeClass('hide');
			this.$toggle.removeClass('show-data');
			this.$toggle.addClass('hide-data');
		}
	};

	LithologyColumnView.prototype.delete = function() {
		if (this.element !== undefined) this.element.remove();
		this.$el.remove();
		this.remove();
	}


	LithologyColumnView.prototype.updateLithologyColumn = function(evt) {
		
		if (evt.keyCode == 13) {
			this.toggleLithologyColumnForm();
		}

		var name = this.$lithologyColumnName.value;
		var description = this.$lithologyColumnDescription.value;
		var width = this.$lithologyColumnWidth.value;
		var bgColor = this.$lithologyColumnBgColor.value;
		
		this.lithologyColumn.set({
			name: name,
			description: description,
			width: parseInt(width) || 0,
		});
		
		this.lithologyColumn.get('settings').set({
			backgroundColor: bgColor
		});
	};

	LithologyColumnView.prototype.createLithologyMarker = function(evt) {
		if (!this.app.enLithologys) return;
		var lithologyMarker = new LithologyMarker({y: evt.offsetY, lithologyColumn: this.lithologyColumn}, this.app);

		if (lithologyMarker.get('zone') === null) {
			lithologyMarker.destroy();
			return;
		}
		
		this.lithologyColumn.get('lithologyMarkers').add(lithologyMarker);
	}

	LithologyColumnView.prototype.addLithologyMarker = function(lithologyMarker) {
		var lithologyMarkerView = new LithologyMarkerView(this.app, lithologyMarker);

		var self = this;
		var lithologys = this.lithologyColumn.get('lithologys');
		var lithologyMarkers = this.lithologyColumn.get('lithologyMarkers');

		lithologyMarkers.sort();

		var index = lithologyMarkers.indexOf(lithologyMarker);

		var topMarker, baseMarker;

		if (lithologyMarkers.length > 1) {
			
			if (index == 0) {
				topMarker = lithologyMarkers.at(index);
				baseMarker = lithologyMarkers.at(index + 1);
			} else {
				topMarker = lithologyMarkers.at(index - 1);
				baseMarker = lithologyMarkers.at(index);
			}
			
			var lithology = lithologys.findWhere({top: topMarker, base: baseMarker}) ||
						new Lithology({top: topMarker, base: baseMarker, lithologyColumn: self.lithologyColumn});
			topMarker.get('lithologys').add(lithology);
			baseMarker.get('lithologys').add(lithology);
			baseMarker.set({
				name: lithology.get('name') + " Base"
			});
			lithologys.add(lithology);
		}
	}

	LithologyColumnView.prototype.removeLithology = function(lithology) {
		var topMarker = lithology.get('top');
		var baseMarker = lithology.get('top');
	}

	LithologyColumnView.prototype.addLithology = function(lithology) {
		var lithologyView = new LithologyView(this.app, lithology);
		this.$lithologysList.append(lithologyView.el);
	}

	LithologyColumnView.prototype.updateLithologyColumns = function() {
		var self = this;
		var stratIndex = this.app.LithologyColumnsCollection.indexOf(this.lithologyColumn);
		this.app.LithologyColumnsCollection.each(function(lithologyColumn, index) {
			if (index > stratIndex) {
				var prevColumn = self.app.LithologyColumnsCollection.at(index - 1);
				var x = prevColumn.get('x') + prevColumn.get('width');
				lithologyColumn.set({
					x: x
				});
			}
		});
	}

	LithologyColumnView.prototype.showLithologysList = function() {
		if (this.$lithologysList.hasClass('hide')) {
			this.$lithologysList.removeClass('hide');
		} else {
			this.$lithologysList.addClass('hide');
		}
	}

	LithologyColumnView.prototype.delete = function() {
		_.invoke(this.lithologyColumn.get('lithologys').toArray(), "destroy");
		if (this.element) this.element.remove();
		this.$el.remove();
		this.remove();
	}

	LithologyColumnView.prototype.destroy = function() {
		this.lithologyColumn.destroy();
	}

	return LithologyColumnView;
});

/*-----  End of LithologyColumnView  ------*/
