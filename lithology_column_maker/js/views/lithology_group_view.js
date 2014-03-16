
/*===============================================================================================================
=            LithologyGroupView is the view that handles changes to the lithologyGroup column it is instantiated with.            =
===============================================================================================================*/

define(["baseView"], function(BaseView) {
	
	var LithologyGroupView = BaseView.extend({
		tagName: 'li',
		classname: "LithologyGroupView",
		events: {
			'click .toggle': 'toggleLithologyGroupForm',
			'click .lithologyGroup-data': 'toggleLithologyGroupForm',
			'click .destroy': 'destroy',
			'keypress :input': 'updateLithologyGroup',
			'keyup :input': 'updateLithologyGroup',
			'change input[name="lithologyGroup-color"]': 'updateLithologyGroup',
			'change select.lithologyGroup-line-style': 'updateLithologyGroup',
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

		this.render();

		/* listen to the events */
		this.listenTo(this.lithologyGroup, 'change:edit', this.editLithologyGroup.bind(this));
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
		
		this.listenTo(this.lithologyGroup.get('settings'), 'change', this.renderLithologyGroup.bind(this));
		this.listenTo(this.lithologyGroup, 'destroy', this.delete.bind(this));

	};

	LithologyGroupView.prototype.render = function() {
		this.$el.html(this.template.render(this.lithologyGroup.toJSON()));
		this.$toggle = this.$(".toggle");
		this.$lithologyGroupForm = this.$(".lithologyGroup-form");
		this.$lithologyGroupData = this.$(".lithologyGroup-data");
		this.$lithologyGroupName = this.$('input[name="lithologyGroup-name"]')[0];
		this.$lithologyGroupAge = this.$('input[name="lithologyGroup-age"]')[0];
		this.$lithologyGroupColor = this.$('input[name="lithologyGroup-color"]')[0];
		this.$lithologyGroupDescription = this.$('textarea[name="lithologyGroup-description"]')[0];

		/* check edit state */
		this.editLithologyGroup();

		this.renderLithologyGroup();
	};

	LithologyGroupView.prototype.renderLithologyGroup = function() {
		this.renderLithologyGroupBlock();
		this.renderLithologyGroupPatternsBlock();
	}

	LithologyGroupView.prototype.renderLithologyGroupBlock = function() {

		var width = Math.floor(this.lithologyGroup.get('lithologyColumn').get('width')/2);

		if (this.bgBox === undefined) {
			this.bgBox = this.app.Canvas.rect();
			this.lithologyGroupText = this.app.Canvas.text();
			this.bBox = this.app.Canvas.rect();
			
			this.lithologyGroupSet.push(this.bgBox);
			this.lithologyGroupSet.push(this.lithologyGroupText);
			this.lithologyGroupSet.push(this.bBox);

			this.app.MarkersSet.toFront();
			this.app.LithologyGroupMarkersSet.toFront();

			this.bBox.hover(this.onMouseOver.bind(this), this.onMouseOut.bind(this));
		}

		this.bgBox.attr({
			"stroke-width" : 0,
			"fill"         : this.lithologyGroup.get('settings').get('backgroundColor'),
			"x"            : this.lithologyGroup.get('lithologyColumn').get('x'),
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
			"stroke-width" : 2,
			"opacity"      : 0,
			"fill"         : "#FFF",
			"x"            : this.lithologyGroup.get('lithologyColumn').get('x'),
			"y"            : this.top.get('y'),
			"width"        : width,
			"height"       : this.base.get('y') - this.top.get('y'),
		});

		this.renderTooltip();
	}

	LithologyGroupView.prototype.renderLithologyGroupPatternsBlock = function() {
		var width = Math.floor(this.lithologyGroup.get('lithologyColumn').get('width')/2);
		var x = this.lithologyGroup.get('lithologyColumn').get('x') + width;


		if (this.patternsBox === undefined) {
			this.patternsBox = this.app.Canvas.rect();
			
			this.lithologyGroupSet.push(this.patternsBox);

			this.app.MarkersSet.toFront();
			this.app.LithologyGroupMarkersSet.toFront();
		}

		this.patternsBox.attr({
			"stroke-width" : 0,
			"fill"         : "#FFF",
			"x"            : x,
			"y"            : this.top.get('y'),
			"width"        : width,
			"height"       : this.base.get('y') - this.top.get('y'),
		});
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
		if (this.lithologyGroupText) this.lithologyGroupText.remove();
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

	LithologyGroupView.prototype.updateLithologyGroup = function(evt) {
		if (evt.keyCode === 13) {
			this.toggleLithologyGroupForm();
		}
		var name = this.$lithologyGroupName.value;
		var description = this.$lithologyGroupDescription.value;
		var color = this.$lithologyGroupColor.value;
		var style = this.$("select.lithologyGroup-line-style option:selected").val();
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
