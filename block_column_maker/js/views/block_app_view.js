
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
	"dataExportView",
	"exporter",
	], function(
		BaseView,
		CursorView,
		FileSystemView,
		Markers,
		MarkersView,
		Zones,
		ZonesView,
		BlockColumns,
		BlockColumnsView,
		DataExportView,
		Exporter) {

	var BlockAppView = BaseView.extend({
		el: ".container",
		classname: "BlockAppView",
		events: {
			'click a.block-settings': 'showSettings',
			'click a.maker-tools': 'enableTool',
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

		//
		this.blockApp.exporter = new Exporter(this.blockApp);

		// Initialize the models
		this.blockApp.Canvas = new Raphael(this.$canvas[0], 2000, 2000);
		// 
		this.blockApp.MarkersSet = this.blockApp.Canvas.set();
		this.blockApp.BlockMarkersSet = this.blockApp.Canvas.set();
		this.blockApp.BlocksSet = this.blockApp.Canvas.set();
		
		this.render();

		this.listenToActionEvents();
	};

	BlockAppView.prototype.listenToActionEvents = function() {
		var self = this;
		$(".close-reveal-modal").click(function(evt) { $(evt.target).parent().foundation('reveal', 'close') });
		
		$('a[href=#continue-load-from-local-storage]').click(function(evt) { 
			$(evt.target).parent().foundation('reveal', 'close');
			self.loadFromLocalStorage();
		});
		
		$('a[href=#continue-save-to-local-storage]').click(function(evt) {
			$(evt.target).parent().foundation('reveal', 'close');
			self.saveToLocalStorage();
		});
	}

	BlockAppView.prototype.showCanvas = function() {
		this.$canvas.removeClass('hide');
		this.$introScreen.addClass('hide');
	}

	BlockAppView.prototype.render = function() {
		this.dataExportView = new DataExportView(this.blockApp);

		this.cursorView = new CursorView(this.blockApp);
		this.fileSystemView = new FileSystemView(this.blockApp);

		this.zonesView = new ZonesView(this.blockApp);
		this.markersView = new MarkersView(this.blockApp);

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


	BlockAppView.prototype.toggleBlocks = function(evt) {		
		if ($("a[href='#add-block']").parent().hasClass('active')) {
			$("a[href='#add-block']").parent().removeClass('active');
			this.blockApp.enBlocks = false;
		} else {
			$("a[href='#add-block']").parent().addClass('active');
			this.blockApp.enBlocks = true;
		}
	};

	BlockAppView.prototype.enableTool = function(evt) {
		var source = evt.target.getAttribute('href');

		
		if (this.markersView.enMarkers) {
			this.markersView.toggleMarkers();	
		}
		
		if (this.blockApp.enBlocks) {
			this.toggleBlocks();	
		}
		
		switch(source) {
			case "#add-marker":
				this.markersView.toggleMarkers();
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
			case "#add-block":
				this.toggleBlocks();
				break;
			default:
				break;
		}
	};

	return BlockAppView;
});
/*-----  End of Section comment block  ------*/

