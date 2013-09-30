/*====================================================================
=            TransectView is the basic view for transects            =
====================================================================*/

var TransectView = BaseView.extend({
	el: ".container",
	classname: "TransectView",
	events: {
		'click a.transect-settings': 'showSettings',
		'click a.transect-tools': 'enableTool',
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
	this.transectWellsView = new TransectWellsView();
	this.renderTransectImage();
};

/**

	TODO:
	- Render transect image is temporary, will have to attach event to change transect image.

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


TransectView.prototype.enableTool = function(evt) {
	var source = evt.target.getAttribute('href');
	this.transectMarkersView.enMarkers = false;
	this.transectWellsView.enWells = false;
	switch(source) {
		case "#add-marker":
			this.transectMarkersView.enMarkers = true;
			break;
		case "#add-well":
			this.transectWellsView.enWells = true;
			break;
		default:
			break;
	}
};
/*-----  End of Section comment block  ------*/

