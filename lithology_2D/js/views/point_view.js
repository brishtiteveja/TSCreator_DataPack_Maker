define(["baseView"], function(BaseView) {
	var PointView = BaseView.extend({
		tagName: 'li',
		events: {

		}
	});

	PointView.prototype.template = new EJS({
		url: '/lithology_2D/ejs/point.ejs'
	});

	PointView.prototype.initialize = function(app, point) {
		this.app = app;
		this.point = point;
		this.render();

		this.app.map.on("move", this.updatePoint.bind(this));
		this.listenTo(this.point, 'change:x', this.renderPoint.bind(this));
		this.listenTo(this.point, 'change:y', this.renderPoint.bind(this));
	}

	PointView.prototype.render = function() {
		this.renderPoint();
	}

	PointView.prototype.renderPoint = function() {
		if (this.element === undefined) {
			this.element = this.app.Paper.circle(this.point.get('x'), this.point.get('y'), 4);

			// this.element.hover(this.onMouseOver.bind(this), this.onMouseOut.bind(this));
			// this.element.click(this.onClick.bind(this));
			// this.element.drag(this.onDragMove.bind(this), this.onDragStart.bind(this), this.onDragEnd.bind(this));

			this.element.attr({
				'fill': "#ffff00"
			});
		}

		this.updateElement();
	}

	PointView.prototype.updateElement = function() {
		this.element.attr({
			'cx': this.point.get('x'),
			'cy': this.point.get('y'),
		});
	}

	PointView.prototype.updatePoint = function() {

		var wCdts = {
			lat: this.point.get('lat'),
			lon: this.point.get('lon')
		};

		var cdts = this.app.map.locationPoint(wCdts);

		this.point.set({
			x: cdts.x || this.point.get('x'),
			y: cdts.y || this.point.get('y')
		})
	}

	return PointView;
});