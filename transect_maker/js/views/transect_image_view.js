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
			'change input[name="image-visible"]': 'updateImage',
			'change input[name="angle"]': 'updateImage',
			"dragover #image-box": "imageDragover",
			"drop #image-box": "imageDrop",
		}
	});

	TransectImageView.prototype.template = new EJS({url: '/transect_maker/ejs/transect_image_settings.ejs'});

	TransectImageView.prototype.initialize = function(app) {
		this.app = app;
		this.transectImage = this.app.TransectImage;

		this.listenTo(this.transectImage, 'change:data', this.renderData.bind(this));
		this.listenTo(this.transectImage, 'change:width', this.renderImage.bind(this));
		this.listenTo(this.transectImage, 'change:height', this.renderImage.bind(this));
		this.listenTo(this.transectImage, 'change:angle', this.renderImage.bind(this));
		this.listenTo(this.transectImage, 'change:preserveAspectRatio', this.renderImage.bind(this));
		this.render();
	};

	TransectImageView.prototype.render = function() {
		this.$el.html(this.template.render(this.transectImage.toJSON()));
		this.$width = this.$('input[name="width"]')[0];
		this.$height = this.$('input[name="height"]')[0];
		this.$preserveAspectRatio = this.$('input[name="preserve-aspect-ratio"]')[0];
		this.$visible = this.$('input[name="image-visible"]')[0];
		this.$angle = this.$('input[name="angle"]')[0];
		this.renderData();
	};

	TransectImageView.prototype.renderData = function() {
		if (this.transectImage.get("data") === null) return;
		if (this.element) this.element.remove();
		this.element = this.app.Canvas.image(this.transectImage.get('data'));
		this.renderImage();
	}

	TransectImageView.prototype.renderImage = function() {
		if (this.element === undefined) {
			this.element = this.app.Canvas.image(this.transectImage.get('data'));
		}
		this.element.toBack();
		this.app.transectImageElement = this.element;
		this.element.attr({
			x: this.transectImage.get('x'),
			y: this.transectImage.get('y'),
			width: this.transectImage.get('width'),
			height: this.transectImage.get('height'),
			opacity: this.transectImage.get('visible') ? 1 : 0,
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
		this.app.Canvas.setSize(bBox.width + 50, bBox.height + 50);
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
			visible: this.$visible.checked,
		});
	}

	TransectImageView.prototype.imageDragover = function(evt) {
		var evt = evt.originalEvent;
		evt.stopPropagation();
    	evt.preventDefault();
    	evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
	}


	TransectImageView.prototype.imageDrop = function(evt) {
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

	TransectImageView.prototype.readImage = function(evt) {
		var self = this;
		var img = new Image();
		$(img).load(function() {
			self.app.TransectImage.set({
				"data": evt.target.result,
				"width": img.width,
				"height": img.height,
			});
		});
		img.src = evt.target.result;
	}

	return TransectImageView;
});
/*-----  End of TransectImageView  ------*/