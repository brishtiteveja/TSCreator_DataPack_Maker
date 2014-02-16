
/*====================================================================
=            ReferenceBlockAppView is the basic view for blocks            =
====================================================================*/

define([
	"baseView",
	"cursorView",
	"fileSystemView",
	"referenceBlockColumns",
	"referenceBlockColumnsView",
	"dataExportView",
	"loader",
	"exporter",
	], function(
		BaseView,
		CursorView,
		FileSystemView,
		ReferenceBlockColumns,
		ReferenceBlockColumnsView,
		DataExportView,
		Loader,
		Exporter) {

	var ReferenceBlockAppView = BaseView.extend({
		el: ".container",
		classname: "ReferenceBlockAppView",
		events: {
			'click a.block-settings': 'showSettings',
			'click a.maker-tools': 'enableTool',
			'click a.continue': 'showCanvas',
			"dragover #data-box": "dataDragover",
			"drop #data-box": "dataDrop",
		}
	});

	/*==========  Initialize block view  ==========*/

	ReferenceBlockAppView.prototype.initialize = function() {

		this.referenceColumnApp = {type : "reference-block"};

		this.referenceColumnApp.ReferenceBlockColumnsCollection = new ReferenceBlockColumns();

		this.referenceColumnApp.StatusBox = $(".status-box");

		// refer to the important DOM elements.

		this.$introScreen = this.$("#intro-screen");
		this.referenceColumnApp.$canvas = this.$("#canvas");
		this.$canvas  = this.referenceColumnApp.$canvas;
		this.$displayPanels = this.$('.display-panel');

		//
		this.referenceColumnApp.loader = new Loader(this.referenceColumnApp);
		this.referenceColumnApp.exporter = new Exporter(this.referenceColumnApp);

		// Initialize the models
		this.referenceColumnApp.Canvas = new Raphael(this.$canvas[0], 2000, 2000);
		// 
		this.referenceColumnApp.MarkersSet = this.referenceColumnApp.Canvas.set();
		this.referenceColumnApp.BlockMarkersSet = this.referenceColumnApp.Canvas.set();
		this.referenceColumnApp.BlocksSet = this.referenceColumnApp.Canvas.set();
		
		this.render();

		this.listenToActionEvents();
	};

	ReferenceBlockAppView.prototype.listenToActionEvents = function() {
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

	ReferenceBlockAppView.prototype.showCanvas = function() {
		this.$canvas.removeClass('hide');
		this.$introScreen.addClass('hide');
	}

	ReferenceBlockAppView.prototype.render = function() {
		this.dataExportView = new DataExportView(this.referenceColumnApp);

		this.cursorView = new CursorView(this.referenceColumnApp);
		this.fileSystemView = new FileSystemView(this.referenceColumnApp);

		this.blockColumnsView = new ReferenceBlockColumnsView(this.referenceColumnApp);
	};

	/**

		TODO:
		- Render block image is temporary, will have to attach event to change block image.

	**/

	ReferenceBlockAppView.prototype.showSettings = function(evt) {
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

	ReferenceBlockAppView.prototype.showExportDataPanel = function(evt) {
		if (this.$exportPanel.hasClass('active')) {
		} else {
			this.dataExportView.render();
		}
	}

	ReferenceBlockAppView.prototype.exportCanvasAsImage = function() {}

	ReferenceBlockAppView.prototype.saveToLocalStorage = function() {
		this.referenceColumnApp.exporter.export();
		localStorage.referenceColumnApp = this.referenceColumnApp.exporter.getJSON();
	}

	ReferenceBlockAppView.prototype.loadFromLocalStorage = function() {
		this.showCanvas();
		this.referenceColumnApp.loader.loadFromLocalStorage();
	}


	ReferenceBlockAppView.prototype.dataDragover = function(evt) {
		var evt = evt.originalEvent;
		evt.stopPropagation();
    	evt.preventDefault();
	}


	ReferenceBlockAppView.prototype.dataDrop = function(evt) {
		var self = this;
		var evt = evt.originalEvent;
		evt.stopPropagation();
    	evt.preventDefault();
    	var file = evt.dataTransfer.files[0];
    	var ext = file.name.split('.').pop();
    	if (file.type === "application/json") {
	    	var reader = new FileReader();
			reader.onloadend = function(e) {
				self.showCanvas();
				if (ext === "json") {
					self.referenceColumnApp.loader.loadData(this.result);
				} else if (ext === "txt") {
					self.referenceColumnApp.loader.loadTextData(this.result);
				}
			};
	    	reader.readAsText(file);	
    	}
	}


	ReferenceBlockAppView.prototype.toggleBlocks = function(evt) {		
		if ($("a[href='#add-block']").parent().hasClass('active')) {
			$("a[href='#add-block']").parent().removeClass('active');
			this.referenceColumnApp.enBlocks = false;
		} else {
			$("a[href='#add-block']").parent().addClass('active');
			this.referenceColumnApp.enBlocks = true;
		}
	};

	ReferenceBlockAppView.prototype.dataDragover = function(evt) {
		var evt = evt.originalEvent;
		evt.stopPropagation();
    	evt.preventDefault();
	}


	ReferenceBlockAppView.prototype.dataDrop = function(evt) {
    	$("#loading").removeClass("hide");
		var self = this;
		var evt = evt.originalEvent;
		evt.stopPropagation();
    	evt.preventDefault();
    	var file = evt.dataTransfer.files[0];
    	var ext = file.name.split(".").pop();
    	var reader = new FileReader();
		reader.onloadend = function(e) {
			self.showCanvas();
			if (ext === "json") {
				self.referenceColumnApp.loader.loadJSONData(this.result);
			}
			if (ext === "txt") {
				self.referenceColumnApp.loader.loadTextData(this.result);
			}
			$("#loading").addClass("hide");
		};
    	reader.readAsText(file);
	}

	ReferenceBlockAppView.prototype.enableTool = function(evt) {
		var source = evt.target.getAttribute('href');
		
		if (this.referenceColumnApp.enBlocks) {
			this.toggleBlocks();	
		}
		
		switch(source) {
			case "#export-data":
				this.dataExportView.toggleExportView();
				break;
			case "#file-system":
				this.fileSystemView.toggleView();
				break;
			case "#save-to-local-storage":
				$('#quick-save-data').foundation('reveal', 'open');
				break;
			case "#reload-data":
				$('#load-saved-data').foundation('reveal', 'open');
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

	return ReferenceBlockAppView;
});

/*-----  End of Section comment block  ------*/

