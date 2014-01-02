var transectApp = transectApp || {};
/*=========================================
=            TransectImageView            =
=========================================*/

define(["baseView", "transectImage"], function(BaseView, TransectImage) {
	var TransectImageView = BaseView.extend({
		el: '#bg-image-settings-list',
		classname: 'TransectImageView',
		events: {
			'change input[name="width"]': 'updateImageWidth',
			'change input[name="height"]': 'updateImageHeight',
			'change input[name="preserve-aspect-ratio"]': 'updateImage',
			'change input[name="angle"]': 'updateImage',
		}
	});

	TransectImageView.prototype.template = new EJS({url: '/transect_maker/ejs/transect_image_settings.ejs'});

	TransectImageView.prototype.initialize = function() {
		transectApp.TransectImage = new TransectImage({});
		this.transectImage = transectApp.TransectImage;

		this.listenTo(this.transectImage, 'change', this.renderImage.bind(this));
		this.render();
	};

	TransectImageView.prototype.render = function() {
		this.$el.html(this.template.render(this.transectImage.toJSON()));
		this.$width = this.$('input[name="width"]')[0];
		this.$height = this.$('input[name="height"]')[0];
		this.$preserveAspectRatio = this.$('input[name="preserve-aspect-ratio"]')[0];
		this.$angle = this.$('input[name="angle"]')[0];
	};

	TransectImageView.prototype.renderImage = function() {
		if (this.transectImage.get("data") === null) return;
		if (this.element === undefined) {
			this.element = transectApp.Canvas.image(this.transectImage.get('data'));
			this.element.toBack();
			transectApp.transectImageElement = this.element;
		}
		this.element.attr({
			x: this.transectImage.get('x'),
			y: this.transectImage.get('y'),
			width: this.transectImage.get('width'),
			height: this.transectImage.get('height')
		});

		if(this.transectImage.get("origHeight") == null || this.transectImage.get("origWidth") == null) {
			this.transectImage.set({
				origWidth: this.transectImage.get('width'),
				origHeight: this.transectImage.get('height'),
			});
		}

		this.rotate(this.transectImage.get('angle'));
		this.updateHtmlElements();
		this.resizeCanvas();
	}

	TransectImageView.prototype.updateHtmlElements = function() {
		if (this.transectImage.get("data") === null) return;
		this.$width.value = this.transectImage.get('width');
		this.$height.value = this.transectImage.get('height');
		this.$angle.value = this.transectImage.get('angle');
	}

	TransectImageView.prototype.rotate = function(angle) {
		if (this.transectImage.get("data") === null) return;
		var tstr = "t0,0r"+angle;
		this.element.transform(tstr);
	}

	TransectImageView.prototype.resizeCanvas = function() {
		if (this.transectImage.get("data") === null) return;
		var bBox = this.element.getBBox();
		// translate image such that it lies on origin.
		var tstr = "t" + (-bBox.x) + "," + (-bBox.y) + "r" + this.transectImage.get('angle');
		this.element.transform(tstr);
		transectApp.Canvas.setSize(bBox.width + 50, bBox.height + 50);
	}

	TransectImageView.prototype.updateImageWidth = function() {
		if (this.transectImage.get("data") === null) return;
		if (this.transectImage.get('preserveAspectRatio')) {
			var height = parseInt(this.$width.value)*this.transectImage.get('origHeight')/this.transectImage.get('origWidth');
			this.$height.value = height;
		}
		this.updateImage();
	}

	TransectImageView.prototype.updateImageHeight = function() {
		if (this.transectImage.get("data") === null) return;
		if (this.transectImage.get('preserveAspectRatio')) {
			var width = parseInt(this.$height.value)*this.transectImage.get('origWidth')/this.transectImage.get('origHeight');
			this.$width.value = width;
		}
		this.updateImage();
	}

	TransectImageView.prototype.updateImage = function() {
		if (this.transectImage.get("data") === null) return;
		this.transectImage.set({
			width: parseInt(this.$width.value),
			height: parseInt(this.$height.value),
			angle: parseFloat(this.$angle.value),
			preserveAspectRatio: this.$preserveAspectRatio.checked,
		});
	}

	return TransectImageView;
});
/*-----  End of TransectImageView  ------*/