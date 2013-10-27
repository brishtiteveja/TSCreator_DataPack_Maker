/*====================================================================
=            TransectAppView is the basic view for transects            =
====================================================================*/

var TransectAppView = BaseView.extend({
	el: ".container",
	classname: "TransectAppView",
	events: {
		'click a.transect-settings': 'showSettings',
		'click a.transect-tools': 'enableTool',
	}
});

/*==========  Initialize transect view  ==========*/

TransectAppView.prototype.initialize = function() {
	this.$canvas = $("#canvas");
	Canvas = new Raphael(this.$canvas[0], this.width, this.height);
	PointsSet = Canvas.set();
	LinesSet = Canvas.set();
	PolygonsSet = Canvas.set();

	POLYGON_COLOR = "#000000";
	
	this.x = 10;
	this.y = 10;
	this.width = 1000;
	this.height = 1000;
	
	this.render();
};

TransectAppView.prototype.render = function() {
	this.transectsView = new TransectsView();
	this.transectMarkersView = new TransectMarkersView();
	this.transectWellsView = new TransectWellsView();
	this.zonesView = new ZonesView();
	this.polygonsView = new PolygonsView();
	this.renderTransectImage();
};

/**

	TODO:
	- Render transect image is temporary, will have to attach event to change transect image.

**/

TransectAppView.prototype.renderTransectImage = function() {
	var transectImage = new TransectImage({url: "/images/transect.gif", x: this.x, y: this.y});
	var transectImageView = new TransectImageView(transectImage);
};

TransectAppView.prototype.showSettings = function(evt) {
	this.$('.settings-list').removeClass('active');
	var id = evt.target.getAttribute('href') + "-settings";
	$(id).addClass('active');
};


TransectAppView.prototype.enableTool = function(evt) {
	var source = evt.target.getAttribute('href');
	this.transectMarkersView.enMarkers = false;
	this.transectWellsView.enWells = false;
	this.polygonsView.disableAllPolygons();
	switch(source) {
		case "#add-marker":
			this.transectMarkersView.enMarkers = true;
			break;
		case "#add-well":
			this.transectWellsView.enWells = true;
			break;
		case "#add-polygon":
			this.polygonsView.createPolygon();
			break;
		default:
			break;
	}
};
/*-----  End of Section comment block  ------*/

