/*====================================================================
=            TransectView is the basic view for transects            =
====================================================================*/

var TransectView = BaseView.extend({
	el: ".container",
	classname: "TransectView",
	events: {
		'click a[href*="transects"]': 'showSettings',
		'click a[href*="wells"]': 'showSettings',
		'click a[href*="polygons"]': 'showSettings',
		'click a[href*="markers"]': 'showSettings',
		'click a[href*="defaults"]': 'showSettings',
	}
});

/*==========  Initialize transect view  ==========*/

TransectView.prototype.initialize = function() {
	this.$canvas = $("#canvas");
	this.x = 10;
	this.y = 10;
	this.width = 1000;
	this.height = 1000;
	Canvas = new Raphael(this.$canvas[0], this.width, this.height);
	this.render();
};

TransectView.prototype.render = function() {
	this.transectMarkersView = new TransectMarkersView();
	this.renderTransectImage();
};

/**

	TODO:
	- Render transect image is temporary will have to attach event to change transect image.

**/

TransectView.prototype.renderTransectImage = function() {
	var transectImage = new TransectImage({url: "/images/transect.gif", x: this.x, y: this.y});
	var transectImageView = new TransectImageView(transectImage);
};

TransectView.prototype.showSettings = function(evt) {
	this.$('.settings-list').removeClass('active');
	var id = evt.target.getAttribute('href') + "-settings";
	$(id).addClass('active');
};
/*-----  End of Section comment block  ------*/

