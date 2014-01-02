/*====================================================================
=            TransectAppView is the basic view for transects            =
====================================================================*/
var transectApp = transectApp || {};

define([
	"baseView",
	"cursorView",
	"transectsView",
	"transectImageView",
	"transectMarkersView",
	"transectWellsView",
	"transectTextsView",
	"zonesView",
	"polygonsView",
	"dataImportView",
	"dataExportView",
	"transectImage",
	"loader",
	"exporter"
	], function(
		BaseView,
		CursorView,
		TransectsView,
		TransectImageView,
		TransectMarkersView,
		TransectWellsView,
		TransectTextsView,
		ZonesView,
		PolygonsView,
		DataImportView,
		DataExportView,
		TransectImage,
		Loader,
		Exporter) {
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
		this.$introScreen = this.$("#intro-screen");
		this.$canvas = this.$("#canvas");
		transectApp.StatusBox = $(".status-box");
		transectApp.TransectImage = new TransectImage({});
		transectApp.Canvas = new Raphael(this.$canvas[0], this.width, this.height);
		transectApp.loader = new Loader();
		transectApp.exporter = new Exporter();
		PointsSet = transectApp.Canvas.set();
		LinesSet = transectApp.Canvas.set();
		PolygonsSet = transectApp.Canvas.set();

		transectApp.CurrentPolygon = null;

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
		this.cursorView = new CursorView();
		this.transectsView = new TransectsView();
		this.transectMarkersView = new TransectMarkersView();
		this.transectWellsView = new TransectWellsView();
		this.transectTextsView = new TransectTextsView();
		this.zonesView = new ZonesView();
		this.polygonsView = new PolygonsView();
		this.dataImportView = new DataImportView();
		this.dataExportView = new DataExportView();
		this.transectImageView = new TransectImageView();
	};

	/**

		TODO:
		- Render transect image is temporary, will have to attach event to change transect image.

	**/

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
		} else {
			this.dataExportView.render();
		}
	}

	TransectAppView.prototype.exportCanvasAsImage = function() {}

	TransectAppView.prototype.saveToLocalStorage = function() {
		transectApp.exporter.export();
		localStorage.transectApp = transectApp.exporter.getJSON();
	}

	TransectAppView.prototype.loadFromLocalStorage = function() {
		transectApp.loader.loadFromLocalStorage();
	}

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
				this.dataExportView.toggleExportView();
				break;
			case "#save-to-local-storage":
				this.saveToLocalStorage();
				break;
			case "#import-data":
				this.loadFromLocalStorage();
			default:
				break;
		}
	};

	return TransectAppView;
});
/*-----  End of Section comment block  ------*/

