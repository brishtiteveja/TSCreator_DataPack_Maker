
/*===================================================================================================================================
=            LithologyGroupView is the view that handles changes to the lithologyGroup column it is instantiated with.              =
===================================================================================================================================*/

define(["baseView", "lithologyMarker", "lithologyMarkerView", "lithology", "lithologyView"], function(BaseView, LithologyMarker, LithologyMarkerView, Lithology, LithologyView) {
	
	var LithologyGroupView = BaseView.extend({
		tagName: 'li',
		classname: "LithologyGroupView",
		events: {
			'click .toggle': 'toggleLithologyGroupForm',
			'click .lithology-group-data': 'toggleLithologyGroupForm',
			'click .destroy': 'destroy',
			'click label.lithology-group-lithologys-data': 'showLithologysList',
			'keypress :input': 'updateLithologyGroup',
			'keyup :input': 'updateLithologyGroup',
			'change input[name="lithology-group-color"]': 'updateLithologyGroup',
			'change select.lithology-group-line-style': 'updateLithologyGroup',
			'mouseover': "onMouseOver",
			'mouseout': "onMouseOut",
		}
	});

	LithologyGroupView.prototype.template = new EJS({url: '/lithology_column_maker/ejs/lithology_group.ejs'});

	LithologyGroupView.prototype.initialize = function(app, lithologyGroup) {
		this.app = app;
		this.lithologyGroup = lithologyGroup;
		this.top = this.lithologyGroup.get('top');
		this.base = this.lithologyGroup.get('base');

		if (this.lithologyGroupSet === undefined) {
			this.lithologyGroupSet = this.app.Canvas.set();
			this.app.LithologyGroupsSet.push(this.lithologyGroupSet);
		}

		/* listen to the events */
		this.listenTo(this.lithologyGroup, 'change:edit', this.render.bind(this));
		this.listenTo(this.lithologyGroup, 'change:hover', this.setHoverStatus.bind(this));
		this.listenTo(this.lithologyGroup, 'change:name', this.renderLithologyGroup.bind(this));
		this.listenTo(this.lithologyGroup, 'change:description', this.renderLithologyGroup.bind(this));
		
		this.listenTo(this.lithologyGroup.get('lithologyColumn'), 'change:x', this.renderLithologyGroup.bind(this));
		this.listenTo(this.lithologyGroup.get('lithologyColumn'), 'change:width', this.renderLithologyGroup.bind(this));
		
		this.listenTo(this.top, 'change:y', this.renderLithologyGroup.bind(this));
		this.listenTo(this.top, 'change:age', this.renderTooltip.bind(this));
		this.listenTo(this.top, 'change:relativeY', this.renderTooltip.bind(this));
		this.listenTo(this.base, 'change:y', this.renderLithologyGroup.bind(this));
		this.listenTo(this.base, 'change:age', this.renderTooltip.bind(this));
		this.listenTo(this.base, 'change:relativeY', this.renderTooltip.bind(this));

		this.listenTo(this.lithologyGroup.get('lithologyMarkers'), 'add', this.addLithologyMarker.bind(this));
		this.listenTo(this.lithologyGroup.get('lithologys'), 'add', this.render.bind(this));
		
		this.listenTo(this.lithologyGroup.get('settings'), 'change', this.renderLithologyGroup.bind(this));
		this.listenTo(this.lithologyGroup, 'destroy', this.delete.bind(this));

		// Render the group
		this.render();

		// initialize the group as one lithology which will be later
		// split into two, when double clicked on it.
		this.initializeLithologyMarkers();

	};

	LithologyGroupView.prototype.render = function() {
		this.$el.html(this.template.render(this.lithologyGroup.toJSON()));
		this.$toggle = this.$(".toggle");
		this.$lithologyGroupForm = this.$(".lithology-group-form");
		this.$lithologyGroupData = this.$(".lithology-group-data");
		this.$lithologyGroupName = this.$('input[name="lithology-group-name"]')[0];
		this.$lithologyGroupAge = this.$('input[name="lithology-group-age"]')[0];
		this.$lithologyGroupColor = this.$('input[name="lithology-group-color"]')[0];
		this.$lithologyGroupDescription = this.$('textarea[name="lithology-group-description"]')[0];
		this.$lithologysList = this.$('.lithologys-list');

		/* check edit state */
		this.editLithologyGroup();

		this.renderLithologyGroup();
		this.lithologyGroup.get('lithologys').each(this.addLithology.bind(this));
	};

	LithologyGroupView.prototype.renderLithologyGroup = function() {
		this.renderLithologyGroupBlock();
	}

	LithologyGroupView.prototype.renderLithologyGroupBlock = function() {

		var width = Math.floor(this.lithologyGroup.get('lithologyColumn').get('width')/2);

		if (this.bgBox === undefined) {
			this.bgBox = this.app.Canvas.rect();
			this.lithologyGroupText = this.app.Canvas.text();
			this.bBox = this.app.Canvas.rect();
			this.bgLithBox = this.app.Canvas.rect();
			
			this.lithologyGroupSet.push(this.bgLithBox);
			this.lithologyGroupSet.push(this.bgBox);
			this.lithologyGroupSet.push(this.lithologyGroupText);
			this.lithologyGroupSet.push(this.bBox);

			this.app.MarkersSet.toFront();
			this.app.LithologyMarkersSet.toFront();
			this.app.LithologyGroupMarkersSet.toFront();

			this.bBox.hover(this.onMouseOver.bind(this), this.onMouseOut.bind(this));
			this.bgLithBox.dblclick(this.createLithologyMarker.bind(this));
		}


		this.bgBox.attr({
			"stroke-width" : 2,
			"stroke"       : "#000000",
			"fill"         : this.lithologyGroup.get('settings').get('backgroundColor'),
			"x"            : this.lithologyGroup.get('lithologyColumn').get('x'),
			"y"            : this.top.get('y'),
			"width"        : width,
			"height"       : this.base.get('y') - this.top.get('y'),
		});
		
		this.bgLithBox.attr({
			"stroke-width" : 0,
			"stroke"       : "#000000",
			"fill"         : "#FFFFFF",
			"x"            : this.lithologyGroup.get('lithologyColumn').get('x') + width,
			"y"            : this.top.get('y'),
			"width"        : width,
			"height"       : this.base.get('y') - this.top.get('y'),
		});

		var textX = Math.round(this.lithologyGroup.get('lithologyColumn').get('x') + width/2);
		var textY = Math.round((this.top.get('y') + this.base.get('y'))/2)
		var textSize = Math.min(Math.round(this.base.get('y') - this.top.get('y')), 16);

		this.lithologyGroupText.attr({
			"x" : textX,
			"y" : textY,
			"text": this.lithologyGroup.get('name'),
			"font-size": textSize,
		});

		this.bBox.attr({
			"stroke-width" : 0,
			"stroke"       : "#000000",
			"opacity"      : 0,
			"fill"         : "#FFFFFF",
			"x"            : this.lithologyGroup.get('lithologyColumn').get('x'),
			"y"            : this.top.get('y'),
			"width"        : width,
			"height"       : this.base.get('y') - this.top.get('y'),
		});

		this.renderTooltip();
	}

	LithologyGroupView.prototype.createLithologyMarker = function (evt) {
		if (!this.app.enLithologys) return;
		var lithologyMarker = this.lithologyGroup.get('lithologyColumn').get('lithologyMarkers').findWhere({y: evt.offsetY}) || new LithologyMarker({y: evt.offsetY, lithologyGroup: this.lithologyGroup}, this.app);
		this.lithologyGroup.get('lithologyMarkers').add(lithologyMarker);
		this.lithologyGroup.get('lithologyColumn').get('lithologyMarkers').add(lithologyMarker);
	}

	LithologyGroupView.prototype.initializeLithologyMarkers = function() {
		var column = this.lithologyGroup.get("lithologyColumn");
		var topMarker = column.get("lithologyMarkers").findWhere({y: this.top.get('y')}) 
		|| new LithologyMarker({y: this.top.get('y'), lithologyGroupMarker: this.top, lithologyGroup: this.lithologyGroup}, this.app);

		this.lithologyGroup.get('lithologyMarkers').add(topMarker);

		var baseMarker = column.get("lithologyMarkers").findWhere({y: this.base.get('y')}) 
		|| new LithologyMarker({y: this.base.get('y'), lithologyGroupMarker: this.base, lithologyGroup: this.lithologyGroup}, this.app);

		this.lithologyGroup.get('lithologyMarkers').add(baseMarker);
	}

	LithologyGroupView.prototype.addLithologyMarker = function(lithologyMarker) {
		var self = this;

		// Add lithology marker to the column markers collection.
		self.lithologyGroup.get('lithologyColumn').get('lithologyMarkers').add(lithologyMarker);
		
		var lithologyMarkerView = new LithologyMarkerView(this.app, lithologyMarker);

		var lithologys = this.lithologyGroup.get('lithologys');
		var lithologyMarkers = this.lithologyGroup.get('lithologyMarkers');

		lithologyMarkers.sort();

		var index = lithologyMarkers.indexOf(lithologyMarker);1

		if (lithologyMarkers.length > 1) {
			
			if (index < lithologyMarkers.length - 1) {
				var topMarker = lithologyMarkers.at(index);
				var baseMarker = lithologyMarkers.at(index + 1);		
				var lithology = lithologys.findWhere({top: topMarker, base: baseMarker}) ||
							new Lithology({top: topMarker, base: baseMarker, lithologyGroup: self.lithologyGroup}, this.app);

				topMarker.get('lithologys').add(lithology);
				baseMarker.get('lithologys').add(lithology);
				baseMarker.set({
					name: lithology.get('name') + " Base"
				});
				this.lithologyGroup.get('lithologys').add(lithology);
			} 
			
			if (index > 0){
				var topMarker = lithologyMarkers.at(index - 1);
				var baseMarker = lithologyMarkers.at(index);
				var lithology = lithologys.findWhere({top: topMarker, base: baseMarker}) ||
							new Lithology({top: topMarker, base: baseMarker, lithologyGroup: self.lithologyGroup}, this.app);

				topMarker.get('lithologys').add(lithology);
				baseMarker.get('lithologys').add(lithology);
				baseMarker.set({
					name: lithology.get('name') + " Base"
				});
				this.lithologyGroup.get('lithologys').add(lithology);
			}
		}
	}

	LithologyGroupView.prototype.addLithology = function(lithology) {
		var lithologyView = new LithologyView(this.app, lithology);
		this.$lithologysList.append(lithologyView.el);
	}

	LithologyGroupView.prototype.renderTooltip = function() {
		$(this.bBox.node).qtip({
			content: {
				text: this.lithologyGroup.get('name') + "<br>" + (this.lithologyGroup.get('description') || "No description yet!")
			},
			position: {
				my: 'bottom left', // Position my top left...
				target: 'mouse', // my target 
			}
		});
	};

	LithologyGroupView.prototype.onMouseOver = function() {
		this.$el.addClass('hover');
		this.lithologyGroup.set({
			hover: true,
		});
	};

	LithologyGroupView.prototype.onMouseOut = function() {
		this.$el.removeClass('hover');
		this.lithologyGroup.set({
			hover: false,
		});
	};


	LithologyGroupView.prototype.setHoverStatus = function() {
		if (this.lithologyGroup.get('hover')) {
			this.$el.addClass('hover');
			this.glow  = this.bBox.glow();
		} else {
			if (this.glow) this.glow.remove();
			this.$el.removeClass('hover');
		}
	}

	LithologyGroupView.prototype.toggleLithologyGroupForm = function() {
		this.render();
		this.lithologyGroup.set({
			'edit': !this.lithologyGroup.get('edit')
		});
	};

	LithologyGroupView.prototype.editLithologyGroup = function() {
		if (this.lithologyGroup.get('edit')) {
			this.$lithologyGroupForm.removeClass('hide');
			this.$lithologyGroupData.addClass('hide');
			this.$toggle.removeClass('hide-data');
			this.$toggle.addClass('show-data');
		} else {
			this.$lithologyGroupForm.addClass('hide');
			this.$lithologyGroupData.removeClass('hide');
			this.$toggle.removeClass('show-data');
			this.$toggle.addClass('hide-data');
		}
	};

	LithologyGroupView.prototype.delete = function() {

		_.invoke(this.lithologyGroup.get('lithologys').toArray(), 'destroy');

		if (this.lithologyGroupText) this.lithologyGroupText.remove();
		if (this.bgLithBox) this.bgLithBox.remove();
		if (this.bgBox) this.bgBox.remove();
		if (this.bBox) this.bBox.remove();
		if (this.glow) this.glow.remove();
		this.$el.remove();
		this.remove();
	}

	LithologyGroupView.prototype.destroy = function() {
		this.lithologyGroup.get('base').set({
			name: "TOP"
		});
		this.lithologyGroup.destroy();
	}


	LithologyGroupView.prototype.showLithologysList = function() {
		if (this.$lithologysList.hasClass('hide')) {
			this.$lithologysList.removeClass('hide');
		} else {
			this.$lithologysList.addClass('hide');
		}
	}

	LithologyGroupView.prototype.updateLithologyGroup = function(evt) {
		if (evt.keyCode === TimescaleApp.ENTER || evt.keyCode === TimescaleApp.ESC) {
			this.toggleLithologyGroupForm();
		}

		var name = this.$lithologyGroupName.value;
		var description = this.$lithologyGroupDescription.value;
		var color = this.$lithologyGroupColor.value;
		var style = this.$("select.lithology-group-line-style option:selected").val();
		this.lithologyGroup.set({
			name: name,
			description: description,
		});

		this.lithologyGroup.get('base').set({
			name: name + " Base"
		});


		this.lithologyGroup.get('settings').set({
			backgroundColor: color
		});

		this.base.set({
			style: style
		});
	}
	
	return LithologyGroupView;
});

/*-----  End of LithologyGroupView  ------*/
