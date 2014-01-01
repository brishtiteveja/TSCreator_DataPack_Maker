/*=========================================
=            TransectImageView            =
=========================================*/

define(["baseView"], function(BaseView) {
	var TransectImageView = BaseView.extend({
		el : '.container',
		classname: 'TransectImageView'
	});

	TransectImageView.prototype.initialize = function(transectImage) {
		this.transectImage = transectImage;
		this.x = transectImage.get('x');
		this.y = transectImage.get('y');
		this.width = transectImage.get('width');
		this.height = transectImage.get('height');
		this.url = this.transectImage.get('url');
		this.render();
	};

	TransectImageView.prototype.render = function() {
		if (this.element === undefined) {
			this.element = transectApp.Canvas.image(this.url, this.x, this.y, this.width, this.height);
			this.element.toBack();
			transectApp.transectImage = this.element;
		}
		transectApp.Canvas.setSize(Math.max(transectApp.Canvas.width, this.width + 50), Math.max(transectApp.Canvas.height, this.height + 50));
	};

	return TransectImageView;
});
/*-----  End of TransectImageView  ------*/

