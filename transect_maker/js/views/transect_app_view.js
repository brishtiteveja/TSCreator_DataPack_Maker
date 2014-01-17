/*====================================================================
=            TransectAppView is the basic view for transects            =
====================================================================*/
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
	"fileSystemView",
	"transectImage",
	"loader",
	"exporter",
	"transects",
	"transectTexts",
	"polygons",
	"lines",
	"points",
	"zones",
	"transectWells",
	"transectMarkers"
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
		FileSystemView,
		TransectImage,
		Loader,
		Exporter,
		Transects,
		TransectTexts,
		Polygons,
		Lines,
		Points,
		Zones,
		TransectWells,
		TransectMarkers) {

	var TransectAppView = BaseView.extend({
		el: ".container",
		classname: "TransectAppView",
		events: {
			'click a.transect-settings': 'showSettings',
			'click a.transect-tools': 'enableTool',
			'click a.continue': 'showCanvas',
			"dragover #data-box": "dataDragover",
			"drop #data-box": "dataDrop",
		}
	});

	/*==========  Initialize transect view  ==========*/

	TransectAppView.prototype.initialize = function() {

		this.transectApp = {};

		this.transectApp.TransectsCollection = new Transects();
		this.transectApp.TransectTextsCollection = new TransectTexts();
		this.transectApp.PolygonsCollection = new Polygons();
		this.transectApp.LinesCollection = new Lines();
		this.transectApp.PointsCollection = new Points();
		this.transectApp.ZonesCollection = new Zones();
		this.transectApp.TransectWellsCollection = new TransectWells();
		this.transectApp.TransectMarkersCollection = new TransectMarkers();

		this.transectApp.CurrentPolygon = null;
		
		this.transectApp.x = 0;
		this.transectApp.y = 0;
		this.transectApp.width = 2000;
		this.transectApp.height = 2000;

		this.transectApp.StatusBox = $(".status-box");

		// refer to the important DOM elements.

		this.$introScreen = this.$("#intro-screen");
		this.transectApp.$canvas = this.$("#canvas");
		this.$canvas  = this.transectApp.$canvas;
		this.$displayPanels = this.$('.display-panel');

		// Initialize the models

		this.transectApp.TransectImage = new TransectImage({});
		this.transectApp.Canvas = new Raphael(this.$canvas[0], this.transectApp.width, this.transectApp.height);
		
		this.transectApp.TextsSet = this.transectApp.Canvas.set();
		this.transectApp.MarkersSet = this.transectApp.Canvas.set();
		this.transectApp.WellsSet = this.transectApp.Canvas.set();
		this.transectApp.PointsSet = this.transectApp.Canvas.set();
		this.transectApp.LinesSet = this.transectApp.Canvas.set();
		this.transectApp.PolygonsSet = this.transectApp.Canvas.set();


		this.transectApp.loader = new Loader(this.transectApp);
		this.transectApp.exporter = new Exporter(this.transectApp);
		
		this.render();
	};

	TransectAppView.prototype.showCanvas = function() {
		this.$canvas.removeClass('hide');
		this.$introScreen.addClass('hide');
	}

	TransectAppView.prototype.render = function() {
		this.dataImportView = new DataImportView(this.transectApp);
		this.dataExportView = new DataExportView(this.transectApp);
		this.fileSystemView = new FileSystemView(this.transectApp);


		this.cursorView = new CursorView(this.transectApp);

		this.transectImageView = new TransectImageView(this.transectApp);

		this.transectMarkersView = new TransectMarkersView(this.transectApp);
		this.zonesView = new ZonesView(this.transectApp);

		this.transectWellsView = new TransectWellsView(this.transectApp);
		this.transectsView = new TransectsView(this.transectApp);

		this.transectTextsView = new TransectTextsView(this.transectApp);



		this.polygonsView = new PolygonsView(this.transectApp);
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
		var isOk = confirm("You are about to save the data. This will override any previous saved data. Are you sure you want to continue ?");
		if (isOk) {
			this.transectApp.exporter.export();
			localStorage.transectApp = this.transectApp.exporter.getJSON();	
		}
	}

	TransectAppView.prototype.loadFromLocalStorage = function() {
		var isOk = confirm("You are about to load the saved data. This will override your current data. Are you sure you want to continue ?");
		if (isOk) {
			$("#loading").removeClass("hide");
			this.transectApp.loader.loadFromLocalStorage();
			this.showCanvas();
			$("#loading").addClass("hide");
		}
	}


	TransectAppView.prototype.dataDragover = function(evt) {
		var evt = evt.originalEvent;
		evt.stopPropagation();
    	evt.preventDefault();
	}


	TransectAppView.prototype.dataDrop = function(evt) {
    	$("#loading").removeClass("hide");
		var self = this;
		var evt = evt.originalEvent;
		evt.stopPropagation();
    	evt.preventDefault();
    	var file = evt.dataTransfer.files[0];
    	var reader = new FileReader();
		reader.onloadend = function(e) {
			self.showCanvas();
			self.transectApp.loader.loadData(this.result);
			$("#loading").addClass("hide");
		};
    	reader.readAsText(file);
	}

	TransectAppView.prototype.enableTool = function(evt) {
		var source = evt.target.getAttribute('href');

		if (
			source === "#new-polygon" ||
			source === "#lock-cursor-h" ||
			source === "#lock-cursor-v"
			) return;

		
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
		
		if (this.transectApp.Cursor.get('lockH')) {
			this.cursorView.toggleHlock();
		}
		
		if (this.transectApp.Cursor.get('lockV')) {
			this.cursorView.toggleVlock();
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
			case "#file-system":
				this.fileSystemView.toggleView();
				break;
			case "#save-to-local-storage":
				this.saveToLocalStorage();
				break;
			case "#reload-data":
				this.loadFromLocalStorage();
			default:
				break;
		}
	};

	return TransectAppView;
});
/*-----  End of Section comment block  ------*/

