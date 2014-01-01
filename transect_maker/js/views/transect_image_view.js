var transectApp = transectApp || {};
/*=========================================
=            TransectImageView            =
=========================================*/

define(["baseView", "transectImage"], function(BaseView, TransectImage) {
	var TransectImageView = BaseView.extend({
		el : '.container',
		classname: 'TransectImageView'
	});

	TransectImageView.prototype.initialize = function() {
		transectApp.TransectImage = new TransectImage({});
		this.transectImage = transectApp.TransectImage;
		this.listenTo(this.transectImage, 'change', this.render.bind(this));
	};

	TransectImageView.prototype.render = function() {
		this.x = this.transectImage.get('x');
		this.y = this.transectImage.get('y');
		this.width = this.transectImage.get('width');
		this.height = this.transectImage.get('height');
		this.data = this.transectImage.get('data');
		if (this.element === undefined) {
			this.element = transectApp.Canvas.image(this.data, this.x, this.y, this.width, this.height);
			this.element.toBack();
			transectApp.transectImageElement = this.element;
		}
		transectApp.Canvas.setSize(Math.max(transectApp.Canvas.width, this.width + 50), Math.max(transectApp.Canvas.height, this.height + 50));
	};

	return TransectImageView;
});
/*-----  End of TransectImageView  ------*/

