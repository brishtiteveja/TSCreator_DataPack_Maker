/*=========================================
=            ImageView            =
=========================================*/

define(["baseView", "image"], function(BaseView, Image) {
	var ImageView = BaseView.extend({
		el: '#bg-image-settings-list',
		classname: 'ImageView',
		events: {
			'change input[name="width"]': 'updateImageWidth',
			'change input[name="height"]': 'updateImageHeight',
			'change input[name="preserve-aspect-ratio"]': 'updateImage',
			'change input[name="image-visible"]': 'updateImage',
			'change input[name="angle"]': 'updateImage',
			"dragover #image-box": "imageDragover",
			"drop #image-box": "imageDrop",
		}
	});

	ImageView.prototype.template = new EJS({url: '/transect_maker/ejs/transect_image_settings.ejs'});

	ImageView.prototype.initialize = function(app) {
		this.app = app;
		this.image = this.app.Image;

		this.listenTo(this.image, 'change:data', this.renderData.bind(this));
		this.listenTo(this.image, 'change:width', this.renderImage.bind(this));
		this.listenTo(this.image, 'change:height', this.renderImage.bind(this));
		this.listenTo(this.image, 'change:angle', this.renderImage.bind(this));
		this.listenTo(this.image, 'change:preserveAspectRatio', this.renderImage.bind(this));
		this.render();
	};

	ImageView.prototype.render = function() {
		this.$el.html(this.template.render(this.image.toJSON()));
		this.$width = this.$('input[name="width"]')[0];
		this.$height = this.$('input[name="height"]')[0];
		this.$preserveAspectRatio = this.$('input[name="preserve-aspect-ratio"]')[0];
		this.$visible = this.$('input[name="image-visible"]')[0];
		this.$angle = this.$('input[name="angle"]')[0];
		this.renderData();
	};

	ImageView.prototype.renderData = function() {
		if (this.image.get("data") === null) return;
		if (this.element) this.element.remove();
		this.element = this.app.Canvas.image(this.image.get('data'));
		this.renderImage();
	}

	ImageView.prototype.renderImage = function() {
		if (this.element === undefined) {
			this.element = this.app.Canvas.image(this.image.get('data'));
		}
		this.element.toBack();
		this.app.imageElement = this.element;
		this.element.attr({
			x: this.image.get('x'),
			y: this.image.get('y'),
			width: this.image.get('width'),
			height: this.image.get('height'),
			opacity: this.image.get('visible') ? 1 : 0,
		});

		if(this.image.get("origHeight") == null || this.image.get("origWidth") == null) {
			this.image.set({
				origWidth: this.image.get('width'),
				origHeight: this.image.get('height'),
			});
		}

		this.rotate(this.image.get('angle'));
		this.updateHtmlElements();
		this.resizeCanvas();
	}

	ImageView.prototype.updateHtmlElements = function() {
		if (this.image.get("data") === null) return;
		this.$width.value = this.image.get('width');
		this.$height.value = this.image.get('height');
		this.$angle.value = this.image.get('angle');
	}

	ImageView.prototype.rotate = function(angle) {
		if (this.image.get("data") === null) return;
		var tstr = "t0,0r"+angle;
		this.element.transform(tstr);
	}

	ImageView.prototype.resizeCanvas = function() {
		if (this.image.get("data") === null) return;
		var bBox = this.element.getBBox();
		// translate image such that it lies on origin.
		var tstr = "t" + (-bBox.x) + "," + (-bBox.y) + "r" + this.image.get('angle');
		this.element.transform(tstr);
		var height = bBox.height + 50;
		if (this.app.refCol && this.app.refCol.Canvas) {
			height = Math.max(this.app.refCol.Canvas, height);
			this.app.refCol.Canvas.setSize(this.app.refCol.Canvas.width, height);
		}
		this.app.Canvas.setSize(bBox.width + 50, height);
	}

	ImageView.prototype.updateImageWidth = function() {
		if (this.image.get("data") === null) return;
		if (this.image.get('preserveAspectRatio')) {
			var height = parseInt(this.$width.value)*this.image.get('origHeight')/this.image.get('origWidth');
			this.$height.value = height;
		}
		this.updateImage();
	}

	ImageView.prototype.updateImageHeight = function() {
		if (this.image.get("data") === null) return;
		if (this.image.get('preserveAspectRatio')) {
			var width = parseInt(this.$height.value)*this.image.get('origWidth')/this.image.get('origHeight');
			this.$width.value = width;
		}
		this.updateImage();
	}

	ImageView.prototype.updateImage = function() {
		if (this.image.get("data") === null) return;
		this.image.set({
			width: parseInt(this.$width.value),
			height: parseInt(this.$height.value),
			angle: parseFloat(this.$angle.value),
			preserveAspectRatio: this.$preserveAspectRatio.checked,
			visible: this.$visible.checked,
		});
	}

	ImageView.prototype.imageDragover = function(evt) {
		var evt = evt.originalEvent;
		evt.stopPropagation();
    	evt.preventDefault();
    	evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
	}


	ImageView.prototype.imageDrop = function(evt) {
		var evt = evt.originalEvent;
		evt.stopPropagation();
    	evt.preventDefault();
    	var file = evt.dataTransfer.files[0];
    	
    	if (file.type === "image/png"
    		|| file.type === "image/jpg"
    		|| file.type === "image/jpeg"
    		|| file.type === "image/gif") {
	    	var reader = new FileReader();
	    	reader.onload = this.readImage.bind(this);
	    	reader.readAsDataURL(file);	
    	}
	}

	ImageView.prototype.readImage = function(evt) {
		var self = this;
		var img = new Image();
		$(img).load(function() {
			self.app.Image.set({
				"data": evt.target.result,
				"width": img.width,
				"height": img.height,
			});
		});
		img.src = evt.target.result;
	}

	return ImageView;
});
/*-----  End of ImageView  ------*/