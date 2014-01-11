/*====================================================================
=            BlockAppView is the basic view for blocks            =
====================================================================*/
define([
	"baseView",
	"cursorView",
	"fileSystemView",
	"markers",
	"markersView",
	"zones",
	"zonesView",
	"blockColumns",
	"blockColumnsView",
	], function(
		BaseView,
		CursorView,
		FileSystemView,
		Markers,
		MarkersView,
		Zones,
		ZonesView,
		BlockColumns,
		BlockColumnsView) {

	var BlockAppView = BaseView.extend({
		el: ".container",
		classname: "BlockAppView",
		events: {
			'click a.block-settings': 'showSettings',
			'click a.block-tools': 'enableTool',
			'click a.continue': 'showCanvas',
			"dragover #data-box": "dataDragover",
			"drop #data-box": "dataDrop",
		}
	});

	/*==========  Initialize block view  ==========*/

	BlockAppView.prototype.initialize = function() {

		this.blockApp = {};

		this.blockApp.BlockColumnsCollection = new BlockColumns();
		this.blockApp.ZonesCollection = new Zones();
		this.blockApp.MarkersCollection = new Markers();

		this.blockApp.StatusBox = $(".status-box");

		// refer to the important DOM elements.

		this.$introScreen = this.$("#intro-screen");
		this.blockApp.$canvas = this.$("#canvas");
		this.$canvas  = this.blockApp.$canvas;
		this.$displayPanels = this.$('.display-panel');

		// Initialize the models
		this.blockApp.Canvas = new Raphael(this.$canvas[0], "100%", "100%");
		// 
		this.blockApp.MarkersSet = this.blockApp.Canvas.set();
		
		this.render();
	};

	BlockAppView.prototype.showCanvas = function() {
		this.$canvas.removeClass('hide');
		this.$introScreen.addClass('hide');
	}

	BlockAppView.prototype.render = function() {
		this.fileSystemView = new FileSystemView(this.blockApp);
		this.cursorView = new CursorView(this.blockApp);

		this.blockMarkersView = new MarkersView(this.blockApp);
		this.zonesView = new ZonesView(this.blockApp);

		this.blockColumnsView = new BlockColumnsView(this.blockApp);
	};

	/**

		TODO:
		- Render block image is temporary, will have to attach event to change block image.

	**/

	BlockAppView.prototype.showSettings = function(evt) {
		var id = evt.target.getAttribute('href') + "-list";
		if ($(id).hasClass('active')) {
			$(id).removeClass('active');
			$(evt.target).removeClass('active');
			$(evt.target).parent().removeClass('active');
			this.$('#sections-panel').removeClass('active');
		} else {
			this.$('.settings-content').removeClass('active');
			this.$('.settings-links').removeClass('active');
			this.$('.block-settings').removeClass('active');
			$(id).addClass('active');
			$(evt.target).addClass('active');
			$(evt.target).parent().addClass('active');
			this.$('#sections-panel').addClass('active');
		}
	};

	BlockAppView.prototype.showExportDataPanel = function(evt) {
		if (this.$exportPanel.hasClass('active')) {
		} else {
			this.dataExportView.render();
		}
	}

	BlockAppView.prototype.exportCanvasAsImage = function() {}

	BlockAppView.prototype.saveToLocalStorage = function() {
		var isOk = confirm("You are about to save the data. This will override any previous saved data. Are you sure you want to continue ?");
		if (isOk) {
			this.blockApp.exporter.export();
			localStorage.blockApp = this.blockApp.exporter.getJSON();	
		}
	}

	BlockAppView.prototype.loadFromLocalStorage = function() {
		var isOk = confirm("You are about to load the saved data. This will override your current data. Are you sure you want to continue ?");
		if (isOk) {
			this.showCanvas();
			this.blockApp.loader.loadFromLocalStorage();	
		}
	}


	BlockAppView.prototype.dataDragover = function(evt) {
		var evt = evt.originalEvent;
		evt.stopPropagation();
    	evt.preventDefault();
	}


	BlockAppView.prototype.dataDrop = function(evt) {
		var self = this;
		var evt = evt.originalEvent;
		evt.stopPropagation();
    	evt.preventDefault();
    	var file = evt.dataTransfer.files[0];
    	
    	if (file.type === "application/json") {
	    	var reader = new FileReader();
			reader.onloadend = function(e) {
				self.showCanvas();
				self.blockApp.loader.loadData(this.result);
			};
	    	reader.readAsText(file);	
    	}
	}

	BlockAppView.prototype.enableTool = function(evt) {
		var source = evt.target.getAttribute('href');

		
		if (this.blockMarkersView.enMarkers) {
			this.blockMarkersView.toggleMarkers();	
		}
		
		switch(source) {
			case "#add-marker":
				this.blockMarkersView.toggleMarkers();
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
				break;
			case "#new-column":
				break;
			default:
				break;
		}
	};

	return BlockAppView;
});
/*-----  End of Section comment block  ------*/

