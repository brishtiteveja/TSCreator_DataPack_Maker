/*========================================
=            TransectTextView            =
========================================*/

define(["baseView", "point", "polyK"], function(BaseView, Point, PolyK) {
	var TransectTextView = BaseView.extend({
		tagName: 'li',
		classname: "TransectTextView",
		events: {
			'click .toggle': 'toggleTextForm',
			'click .text-data': 'toggleTextForm',
			'click .destroy': 'destroy',
			'keypress :input': 'updateText',
			'keyup :input': 'updateText',
			'change select[name="text-font-family"]': 'updateText',
			'change input[name="text-font-size"]': 'updateText',
			'change input[name="text-font-color"]': 'updateText',
			'mouseover': "onMouseOver",
			'mouseout': "onMouseOut",
		}
	});

	/* template for transect text */
	TransectTextView.prototype.template = new EJS({
		url: '/transect_maker/ejs/transect_text.ejs'
	});

	TransectTextView.prototype.initialize = function(app, transectText, transectTextsView) {
		this.app = app;
		this.transectTextsView = transectTextsView;
		this.transectText = transectText;
		this.render();

		this.listenTo(this.transectText, 'update', this.render.bind(this));
		this.listenTo(this.transectText, 'change:x', this.renderTransectText.bind(this));
		this.listenTo(this.transectText, 'change:y', this.renderTransectText.bind(this));
		this.listenTo(this.transectText, 'change:edit', this.editTransectText.bind(this));
		this.listenTo(this.transectText, 'change:text', this.renderTransectText.bind(this));
		this.listenTo(this.transectText, 'change:age', this.updateTscBBox.bind(this));
		this.listenTo(this.transectText, 'destroy', this.delete.bind(this));
		this.listenTo(this.transectText.get('settings'), 'change', this.renderTransectText.bind(this));

		this.listenTo(this.transectText.get('zone'), 'destroy', this.updateTextTransectAndZone.bind(this));
		this.listenTo(this.transectText.get('transect'), 'destroy', this.updateTextTransectAndZone.bind(this));
	}

	TransectTextView.prototype.updateTextTransectAndZone = function(model) {
		this.transectText.updateTransectAndZone();
		this.transectText.update();
	}

	TransectTextView.prototype.render = function() {
		this.$el.html(this.template.render(this.transectText.toJSON()));

		/* get DOM elements after render */
		this.$toggle = this.$(".toggle");
		this.$textForm = this.$(".text-form");
		this.$textData = this.$(".text-data");
		this.$textText = this.$("textarea[name*=text-name]")[0];
		this.$textFontSize = this.$("input[name*=text-font-size]")[0];
		this.$textFontColor = this.$("input[name*=text-font-color]")[0];

		/* check edit state */
		this.editTransectText();

		/* listen to changes in form. */



		this.renderTransectText();
		return this;
	}

	TransectTextView.prototype.renderTransectText = function() {
		this.set = this.app.Paper.set();
		if (this.element === undefined || this.boundingBox === undefined) {

			this.backgroundBox = this.app.Paper.rect();
			this.element = this.app.Paper.text();
			this.boundingBox = this.app.Paper.rect();

			this.set.push(this.backgroundBox);
			this.set.push(this.element);
			this.set.push(this.boundingBox);
			this.app.TextsSet.push(this.set);

			this.boundingBox.hover(this.onMouseOver.bind(this), this.onMouseOut.bind(this));
			this.boundingBox.drag(this.dragMove.bind(this), this.dragStart.bind(this), this.dragEnd.bind(this));
		}

		this.element.attr({
			"text": this.transectText.get('text'),
			"x": this.transectText.get('x'),
			"y": this.transectText.get('y'),
			"font-size": this.transectText.get('settings').get('fontSize'),
			"font-family": this.transectText.get('settings').get('fontFamily'),
			"fill": this.transectText.get('settings').get('fill'),
			"fill-opacity": 1,
		});

		this.backgroundBox.attr({
			"fill": this.isWithinBounds() ? "#fff" : "#ff0000",
			"fill-opacity": 1,
			"r": "2px",
		});

		this.backgroundBox.attr({
			"width": this.element.getBBox().width,
			"height": this.element.getBBox().height,
			"x": this.element.getBBox().x,
			"y": this.element.getBBox().y,
		});

		this.boundingBox.attr({
			"fill": "#f1f1f1",
			"r": "2px",
			"fill-opacity": 0,
			"opacity": 0,
			"width": this.element.getBBox().width,
			"height": this.element.getBBox().height,
			"x": this.element.getBBox().x,
			"y": this.element.getBBox().y,
		});

		this.updateTscBBox();
		this.renderTooltip();
	}

	TransectTextView.prototype.updateTscBBox = function() {
		var transect = this.transectText.get('transect');
		var zone = this.transectText.get('zone');
		var bBox = this.element.getBBox();
		var x00 = bBox.x; // lower left x
		var y00 = bBox.y + bBox.height; // lower left y
		var x11 = bBox.x2; // top right x
		var y11 = bBox.y2 - bBox.height; // top right y
		var x00 = Math.round(transect.getRelativeX(x00) * 1000) / 10;
		var x11 = Math.round(transect.getRelativeX(x11) * 1000) / 10;
		var y00 = Math.round(zone.getAbsoluteAge(y00) * 100) / 100;
		var y11 = Math.round(zone.getAbsoluteAge(y11) * 100) / 100;
		this.transectText.set({
			bBox: {
				x1: x00,
				x2: x11,
				y1: y00,
				y2: y11
			}
		});
	}


	TransectTextView.prototype.renderTooltip = function() {
		var content = this.transectText.get('text') + "<br/>";
		content += this.transectText.get('zone').get('name') + "<br/>";
		content += this.transectText.get('transect').get('name') + "<br/>";
		content += "Font Family: " + this.transectText.get('settings').get('fontFamily') + "<br/>";
		content += "Font Size: " + this.transectText.get('settings').get('fontSize') + "<br/>";

		$(this.boundingBox.node).qtip({
			content: {
				text: content
			},
			position: {
				my: 'top left', // Position my top left...
				target: 'mouse', // my target 
			}
		});
	}

	/*==========  start dragging  ==========*/
	TransectTextView.prototype.dragStart = function(x, y, evt) {};


	/*==========  while dragging  ==========*/
	TransectTextView.prototype.dragMove = function(dx, dy, x, y, evt) {
		var cdts = ViewboxToPaper(this.app, evt.offsetX, evt.offsetY);
		var locationX = cdts.x;
		var locationY = cdts.y;
		var transect = this.app.TransectsCollection.getTransectForX(locationX);
		var zone = this.app.ZonesCollection.getZoneForY(locationY);
		if (transect !== null && zone !== null) {
			this.transectText.set({
				x: locationX,
				y: locationY,
			});
			this.transectText.updateTransectAndZone();
		}
	};

	/*==========  when dragging is completed  ==========*/
	TransectTextView.prototype.dragEnd = function(evt) {};

	TransectTextView.prototype.onMouseOver = function() {
		this.transectTextsView.undelegateEvents();
		this.backgroundBox.attr({
			"fill": "#fdcc59"
		});
		this.$el.addClass('hover');
	};

	TransectTextView.prototype.onMouseOut = function() {
		this.transectTextsView.delegateEvents();
		this.backgroundBox.attr({
			"fill": this.isWithinBounds() ? "#fff" : "#ff0000",
		});
		this.$el.removeClass('hover');
	};


	TransectTextView.prototype.toggleTextForm = function() {
		this.render();
		this.transectText.set({
			'edit': !this.transectText.get('edit')
		});
	};

	TransectTextView.prototype.editTransectText = function() {
		if (this.transectText.get('edit')) {
			this.$textForm.removeClass('hide');
			this.$textData.addClass('hide');
			this.$toggle.removeClass('hide-data');
			this.$toggle.addClass('show-data');
		} else {
			this.$textForm.addClass('hide');
			this.$textData.removeClass('hide');
			this.$toggle.removeClass('show-data');
			this.$toggle.addClass('hide-data');
		}
	};

	TransectTextView.prototype.updateText = function(evt) {

		if (evt.keyCode == TimescaleApp.ESC) {
			this.toggleTextForm();
		}


		var text = this.$textText.value;
		this.transectText.set({
			text: text,
		});
		var fontFamily = this.$("select[name='text-font-family'] option:selected").val();
		this.transectText.get('settings').set({
			fontSize: this.$textFontSize.value,
			fill: this.$textFontColor.value,
			fontFamily: fontFamily,
		})
	};

	TransectTextView.prototype.isWithinBounds = function() {
		var transectBox = this.transectText.get('transect').getPolyKPointsArray();
		var zoneBox = this.transectText.get('zone').getPolyKPointsArray();
		var bBox = this.element.getBBox();
		if (PolyK.ContainsPoint(transectBox, bBox.x, bBox.y) &&
			PolyK.ContainsPoint(transectBox, bBox.x2, bBox.y2) &&
			PolyK.ContainsPoint(zoneBox, bBox.x, bBox.y) &&
			PolyK.ContainsPoint(zoneBox, bBox.x2, bBox.y2)) {
			return true;
		} else {
			return false;
		}
	}

	TransectTextView.prototype.delete = function() {
		if (this.backgroundBox !== undefined) this.backgroundBox.remove();
		if (this.element !== undefined) this.element.remove();
		if (this.boundingBox !== undefined) this.boundingBox.remove();
		if (this.set !== undefined) this.set.remove();
		this.$el.remove();
		this.remove();
	}

	TransectTextView.prototype.destroy = function() {
		this.transectText.destroy();
	}

	return TransectTextView;
});

/*-----  End of TransectTextView  ------*/