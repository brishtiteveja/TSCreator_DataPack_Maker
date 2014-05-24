define(["baseView", "point", "pointView"], function(BaseView, Point, PointView) {

	var PolygonView = BaseView.extend({
		tagName: "li",
		events: {
			'click .toggle': 'togglePolygonForm',
			'click .toggle-polygon': 'togglePolygonForm',
			'click .polygon-data': 'togglePolygonForm',
			'click a.polygon-list-tool': 'showList',
			'click .destroy': 'destroy',
			'click .to-front': 'toFront',
			'keypress :input': 'updatePolygon',
			'keyup :input': 'updatePolygon',
			'mouseover': "onMouseOver",
			'mouseout': "onMouseOut",
		}
	});

	PolygonView.prototype.initialize = function(app, polygon) {
		this.app = app;
		this.polygon = polygon;
		this.listenToActionEvents();
		this.render();
	}

	PolygonView.prototype.template = new EJS({
		url: '/lithology_2D/ejs/polygon.ejs'
	});


	PolygonView.prototype.render = function() {
		// render the view for the polygon in the settings panel.
		this.$el.html(this.template.render(this.polygon.toJSON()));

		// get the appropriate dom elements from the newly added view
		this.$togglePolygon = this.$(".toggle-polygon");
		this.$polygonForm = this.$(".polygon-form");
		this.$polygonData = this.$(".polygon-data");
		this.$polygonName = this.$('input[name="polygon-name"]')[0];
		this.$polygonDescription = this.$('textarea[name="polygon-description"]')[0];

		this.renderPoints();
	}

	PolygonView.prototype.renderPoints = function() {
		this.polygon.get('points').each(this.addPoint.bind(this));
	}

	PolygonView.prototype.listenToActionEvents = function() {
		// add a point when we double click on canvas.
		this.listenTo(this.polygon, 'change:edit', this.toggleEditStatus.bind(this));
		this.listenTo(this.polygon.get('points'), 'add', this.addPoint.bind(this));
		this.listenTo(this.polygon.get('points'), 'change', this.renderPolygonElement.bind(this));
		this.listenTo(this.app.animation, 'change:age', this.setPolygonFill.bind(this));
		$("#map").bind('dblclick', this.createPoint.bind(this));

	}

	PolygonView.prototype.addPoint = function(point) {
		var pointView = new PointView(this.app, point);
		this.renderPolygonElement();
	}

	PolygonView.prototype.renderPolygonElement = function() {
		if (this.element === undefined) {
			this.element = this.app.Paper.path();
			this.app.PolygonSet.push(this.element);
			this.element.mouseover(this.onMouseOver.bind(this));
			this.element.mouseout(this.onMouseOut.bind(this));
		}

		this.element.attr({
			path: this.getPath(),
			stroke: "#ff0000",
			fill: "#FFFF00",
			opacity: 0.8
		});

		this.app.orderElements();
	}

	PolygonView.prototype.createPoint = function(evt) {
		if (!this.polygon.get('draw')) {
			return;
		}

		var cdts = {
			x: evt.offsetX,
			y: evt.offsetY
		};

		var wCdts = this.app.map.pointLocation(cdts);

		var point = this.polygon.get('points').findWhere({
			lat: wCdts.lat,
			lon: wCdts.lon
		}) || new Point({
			x: evt.offsetX,
			y: evt.offsetY,
			lat: wCdts.lat,
			lon: wCdts.lon
		}, this.app);

		this.polygon.get('points').add(point);
	}


	PolygonView.prototype.getPath = function() {
		var path = 'M';
		var self = this;
		this.polygon.get('points').each(function(point, index, points) {
			if (index == 0) {
				path += point.get('x') + ',' + point.get('y');
			} else {
				path += "L" + point.get('x') + ',' + point.get('y');
			}
		});

		path += "Z";
		return path;
	}

	PolygonView.prototype.togglePolygonForm = function() {
		this.render();
		this.polygon.set({
			'edit': !this.polygon.get('edit')
		});
	}

	PolygonView.prototype.toggleEditStatus = function() {
		if (this.polygon.get('edit')) {
			this.$polygonForm.removeClass('hide');
			this.$polygonData.addClass('hide');
			this.$togglePolygon.removeClass('hide-data');
			this.$togglePolygon.addClass('show-data');
		} else {
			this.$polygonForm.addClass('hide');
			this.$polygonData.removeClass('hide');
			this.$togglePolygon.removeClass('show-data');
			this.$togglePolygon.addClass('hide-data');
		}
	}

	PolygonView.prototype.onMouseOver = function() {
		if (!this.element) return;

		if (this.glow !== undefined) {
			this.glow.remove();
		}
		this.glow = this.element.glow({
			color: "#f00",
			width: 40,
			opacity: 1,
		});
		this.glow.show();
		this.$el.addClass('hover');
	}

	PolygonView.prototype.onMouseOut = function() {
		if (!this.element) return;

		if (this.polygon.isSimple()) {
			this.setPolygonFill();
		} else {
			this.setErrorFill();
		}
		if (this.glow !== undefined) {
			this.glow.hide();
		}
		this.$el.removeClass('hover');
	}


	PolygonView.prototype.setErrorFill = function() {}


	PolygonView.prototype.setPolygonFill = function() {
		if (!this.element) return;
		var lithology = this.polygon.get('lithologyColumn').getLithologyForAge(this.app.animation.get('age'));
		if (lithology) {
			var pattern = lithology.get("pattern");
			var fill = pattern ? "url('/pattern_manager/patterns/" + this.app.patternsData[pattern].image + "')" : "#EEEEEE";
			this.element.attr({
				'opacity': 0.5,
				'stroke': 0,
				'fill': fill
			});
		}
	}
	return PolygonView;
});