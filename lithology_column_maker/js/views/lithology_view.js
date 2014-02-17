
/*===============================================================================================================
=            LithologyView is the view that handles changes to the lithology column it is instantiated with.            =
===============================================================================================================*/

define(["baseView"], function(BaseView) {
	
	var LithologyView = BaseView.extend({
		tagName: 'li',
		classname: "LithologyView",
		events: {
			'click .toggle': 'toggleLithologyForm',
			'click .lithology-data': 'toggleLithologyForm',
			'click .destroy': 'destroy',
			'keypress :input': 'updateLithology',
			'keyup :input': 'updateLithology',
			'change input[name="lithology-color"]': 'updateLithology',
			'change select.lithology-line-style': 'updateLithology',
			'mouseover': "onMouseOver",
			'mouseout': "onMouseOut",
		}
	});

	LithologyView.prototype.template = new EJS({url: '/lithology_column_maker/ejs/lithology.ejs'});

	LithologyView.prototype.initialize = function(app, lithology) {
		this.app = app;
		this.lithology = lithology;
		this.top = this.lithology.get('top');
		this.base = this.lithology.get('base');

		if (this.lithologySet === undefined) {
			this.lithologySet = this.app.Canvas.set();
			this.app.LithologysSet.push(this.lithologySet);
		}

		this.render();

		/* listen to the events */
		this.listenTo(this.lithology, 'change:edit', this.editLithology.bind(this));
		this.listenTo(this.lithology, 'change:hover', this.setHoverStatus.bind(this));
		this.listenTo(this.lithology, 'change:name', this.renderLithology.bind(this));
		this.listenTo(this.lithology, 'change:description', this.renderLithology.bind(this));
		
		this.listenTo(this.lithology.get('lithologyColumn'), 'change:x', this.renderLithology.bind(this));
		this.listenTo(this.lithology.get('lithologyColumn'), 'change:width', this.renderLithology.bind(this));
		
		this.listenTo(this.top, 'change:y', this.renderLithology.bind(this));
		this.listenTo(this.top, 'change:age', this.renderTooltip.bind(this));
		this.listenTo(this.top, 'change:relativeY', this.renderTooltip.bind(this));
		this.listenTo(this.base, 'change:y', this.renderLithology.bind(this));
		this.listenTo(this.base, 'change:age', this.renderTooltip.bind(this));
		this.listenTo(this.base, 'change:relativeY', this.renderTooltip.bind(this));
		
		this.listenTo(this.lithology.get('settings'), 'change', this.renderLithology.bind(this));
		this.listenTo(this.lithology, 'destroy', this.delete.bind(this));

	};

	LithologyView.prototype.render = function() {
		this.$el.html(this.template.render(this.lithology.toJSON()));
		this.$toggle = this.$(".toggle");
		this.$lithologyForm = this.$(".lithology-form");
		this.$lithologyData = this.$(".lithology-data");
		this.$lithologyName = this.$('input[name="lithology-name"]')[0];
		this.$lithologyAge = this.$('input[name="lithology-age"]')[0];
		this.$lithologyColor = this.$('input[name="lithology-color"]')[0];
		this.$lithologyDescription = this.$('textarea[name="lithology-description"]')[0];

		/* check edit state */
		this.editLithology();

		this.renderLithology();
	};

	LithologyView.prototype.renderLithology = function() {

		if (this.bgBox === undefined) {
			this.bgBox = this.app.Canvas.rect();
			this.lithologyText = this.app.Canvas.text();
			this.bBox = this.app.Canvas.rect();
			
			this.lithologySet.push(this.bgBox);
			this.lithologySet.push(this.lithologyText);
			this.lithologySet.push(this.bBox);

			this.app.MarkersSet.toFront();
			this.app.LithologyMarkersSet.toFront();

			this.bBox.hover(this.onMouseOver.bind(this), this.onMouseOut.bind(this));
		}

		this.bgBox.attr({
			"stroke-width" : 0,
			"fill"         : this.lithology.get('settings').get('backgroundColor'),
			"x"            : this.lithology.get('lithologyColumn').get('x'),
			"y"            : this.top.get('y'),
			"width"        : this.lithology.get('lithologyColumn').get('width'),
			"height"       : this.base.get('y') - this.top.get('y'),
		});

		var textX = Math.round(this.lithology.get('lithologyColumn').get('x') + this.lithology.get('lithologyColumn').get('width')/2);
		var textY = Math.round((this.top.get('y') + this.base.get('y'))/2)
		var textSize = Math.min(Math.round(this.base.get('y') - this.top.get('y')), 16);

		this.lithologyText.attr({
			"x" : textX,
			"y" : textY,
			"text": this.lithology.get('name'),
			"font-size": textSize,
		});

		this.bBox.attr({
			"stroke-width" : 2,
			"opacity"      : 0,
			"fill"         : "#FFF",
			"x"            : this.lithology.get('lithologyColumn').get('x'),
			"y"            : this.top.get('y'),
			"width"        : this.lithology.get('lithologyColumn').get('width'),
			"height"       : this.base.get('y') - this.top.get('y'),
		});

		this.renderTooltip();
	}

	LithologyView.prototype.renderTooltip = function() {
		$(this.bBox.node).qtip({
			content: {
				text: this.lithology.get('name') + "<br>" + (this.lithology.get('description') || "No description yet!")
			},
			position: {
				my: 'bottom left', // Position my top left...
				target: 'mouse', // my target 
			}
		});
	};

	LithologyView.prototype.onMouseOver = function() {
		this.$el.addClass('hover');
		this.lithology.set({
			hover: true,
		});
	};

	LithologyView.prototype.onMouseOut = function() {
		this.$el.removeClass('hover');
		this.lithology.set({
			hover: false,
		});
	};


	LithologyView.prototype.setHoverStatus = function() {
		if (this.lithology.get('hover')) {
			this.$el.addClass('hover');
			this.glow  = this.bBox.glow();
		} else {
			if (this.glow) this.glow.remove();
			this.$el.removeClass('hover');
		}
	}

	LithologyView.prototype.toggleLithologyForm = function() {
		this.render();
		this.lithology.set({
			'edit': !this.lithology.get('edit')
		});
	};

	LithologyView.prototype.editLithology = function() {
		if (this.lithology.get('edit')) {
			this.$lithologyForm.removeClass('hide');
			this.$lithologyData.addClass('hide');
			this.$toggle.removeClass('hide-data');
			this.$toggle.addClass('show-data');
		} else {
			this.$lithologyForm.addClass('hide');
			this.$lithologyData.removeClass('hide');
			this.$toggle.removeClass('show-data');
			this.$toggle.addClass('hide-data');
		}
	};

	LithologyView.prototype.delete = function() {
		if (this.lithologyText) this.lithologyText.remove();
		if (this.bgBox) this.bgBox.remove();
		if (this.bBox) this.bBox.remove();
		if (this.glow) this.glow.remove();
		this.$el.remove();
		this.remove();
	}

	LithologyView.prototype.destroy = function() {
		this.lithology.get('base').set({
			name: "TOP"
		});
		this.lithology.destroy();
	}

	LithologyView.prototype.updateLithology = function(evt) {
		if (evt.keyCode === 13) {
			this.toggleLithologyForm();
		}
		var name = this.$lithologyName.value;
		var description = this.$lithologyDescription.value;
		var color = this.$lithologyColor.value;
		var style = this.$("select.lithology-line-style option:selected").val();
		this.lithology.set({
			name: name,
			description: description,
		});

		this.lithology.get('base').set({
			name: name + " Base"
		});


		this.lithology.get('settings').set({
			backgroundColor: color
		});

		this.base.set({
			style: style
		});
	}
	
	return LithologyView;
});

/*-----  End of LithologyView  ------*/
