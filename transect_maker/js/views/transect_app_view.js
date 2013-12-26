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
		'click a.continue': 'showCanvas'
	}
});

/*==========  Initialize transect view  ==========*/

TransectAppView.prototype.initialize = function() {
	this.$exportPanel = this.$("#export-panel")
	this.$introScreen = this.$("#intro-screen");
	this.$canvas = this.$("#canvas");
	transectApp.StatusBox = $(".status-box");
	transectApp.Canvas = new Raphael(this.$canvas[0], this.width, this.height);
	PointsSet = transectApp.Canvas.set();
	LinesSet = transectApp.Canvas.set();
	PolygonsSet = transectApp.Canvas.set();

	transectApp.CurrentPolygon = null;

	$.event.props.push('dataTransfer');

	POLYGON_COLOR = "#000000";
	
	this.x = 10;
	this.y = 10;
	this.width = 2000;
	this.height = 2000;
	
	this.render();
};

TransectAppView.prototype.showCanvas = function() {
	this.$(canvas).removeClass('hide');
	this.$introScreen.addClass('hide');
}

TransectAppView.prototype.render = function() {
	this.transectsView = new TransectsView();
	this.transectMarkersView = new TransectMarkersView();
	this.transectWellsView = new TransectWellsView();
	this.transectTextsView = new TransectTextsView();
	this.zonesView = new ZonesView();
	this.polygonsView = new PolygonsView();
	this.dataExportView = new DataExportView();
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

TransectAppView.prototype.showExportDataPanel = function(evt) {
	if (this.$exportPanel.hasClass('active')) {
		this.$exportPanel.removeClass('active');
		this.$canvas.removeClass('hide');
	} else {
		this.dataExportView.render();
		this.$exportPanel.addClass('active');
		this.$canvas.addClass('hide');
	}
}

TransectAppView.prototype.exportCanvasAsImage = function() {}

TransectAppView.prototype.enableTool = function(evt) {
	var source = evt.target.getAttribute('href');

	if (source === "#new-polygon") return;
	
	if (this.transectMarkersView.enMarkers) {
		this.transectMarkersView.toggleMarkers();	
	}

	if (this.transectWellsView.enWells) {
		this.transectWellsView.toggleWells();	
	}

	if (this.transectTextsView.enTransectTexts) {
		this.transectTextsView.toggleTransectTexts();	
	}

	if (this.polygonsView.enPolygons) {
		this.polygonsView.togglePolygons();
	}
	
	this.polygonsView.checkAndDeleteCurrentPolygon();
	
	
	switch(source) {
		case "#add-marker":
			this.transectMarkersView.toggleMarkers();
			break;
		case "#add-well":
			this.transectWellsView.toggleWells();
			break;
		case "#add-transect-text":
			this.transectTextsView.toggleTransectTexts();
			break;
		case "#add-polygon":
			this.polygonsView.togglePolygons();
			break;
		case "#export-data":
			this.showExportDataPanel();
			break;
		default:
			break;
	}
};

/*-----  End of Section comment block  ------*/

