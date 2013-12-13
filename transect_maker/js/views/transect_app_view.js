/*====================================================================
=            TransectAppView is the basic view for transects            =
====================================================================*/
var transectApp = transectApp || {};

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
	transectApp.StatusBox = $(".status-box");
	transectApp.Canvas = new Raphael(this.$canvas[0], this.width, this.height);
	PointsSet = transectApp.Canvas.set();
	LinesSet = transectApp.Canvas.set();
	PolygonsSet = transectApp.Canvas.set();

	POLYGON_COLOR = "#000000";
	
	this.x = 10;
	this.y = 10;
	this.width = 2000;
	this.height = 2000;
	
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
	var transectImage = new TransectImage({url: "/images/Scan2_CentralVulcan-page-001.gif", x: this.x, y: this.y});
	var transectImageView = new TransectImageView(transectImage);
};

TransectAppView.prototype.showSettings = function(evt) {
	var id = evt.target.getAttribute('href') + "-list";
	if ($(id).hasClass('active')) {
		$(id).removeClass('active');
		$(evt.target).removeClass('active');
		$(evt.target).parent().removeClass('active');
		this.$('#sections-panel').removeClass('active');
	} else {
		this.$('.settings-content').removeClass('active');
		this.$('.settings-links').removeClass('active');
		this.$('.transect-settings').removeClass('active');
		$(id).addClass('active');
		$(evt.target).addClass('active');
		$(evt.target).parent().addClass('active');
		this.$('#sections-panel').addClass('active');
	}
};

TransectAppView.prototype.exportCanvasAsImage = function() {
	// the canvas calls to output a png
	// debugger;	
	// svg = transectApp.Canvas.toSVG();
	// document.getElementById('svg-image').innerHTML = svg;
}

TransectAppView.prototype.enableTool = function(evt) {
	var source = evt.target.getAttribute('href');
	this.transectMarkersView.enMarkers = false;
	this.transectWellsView.enWells = false;
	this.polygonsView.disableAllPolygons();
	transectApp.CurrentPolygon = null;
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
		case "#export-image":
			this.exportCanvasAsImage();
			break;
		default:
			break;
	}
};
/*-----  End of Section comment block  ------*/

