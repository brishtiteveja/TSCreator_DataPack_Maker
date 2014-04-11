
/*====================================================================
=            LithologyAppView is the basic view for lithologys            =
====================================================================*/

define([
	"baseView",
	"cursorView",
	"fileSystemView",
	"markers",
	"markersView",
	"zones",
	"zonesView",
	"lithologyColumns",
	"lithologyColumnsView",
	"dataExportView",
	"loader",
	"exporter",
	"referenceColumnSideView",
	"imageView",
	"imageOb"
	], function(
		BaseView,
		CursorView,
		FileSystemView,
		Markers,
		MarkersView,
		Zones,
		ZonesView,
		LithologyColumns,
		LithologyColumnsView,
		DataExportView,
		Loader,
		Exporter,
		ReferenceColumnSideView,
		ImageView,
		ImageOb) {

	var LithologyAppView = BaseView.extend({
		el: ".container",
		classname: "LithologyAppView",
		events: {
			'click a.lithology-settings': 'showSettings',
			'click a.maker-tools': 'enableTool',
			'click a.continue': 'showCanvas',
			"dragover #data-box": "dataDragover",
			"drop #data-box": "dataDrop",
		}
	});

	/*==========  Initialize lithology view  ==========*/

	LithologyAppView.prototype.initialize = function() {

		this.lithologyApp = {type : "lithology"};

		this.lithologyApp.LithologyColumnsCollection = new LithologyColumns();
		this.lithologyApp.ZonesCollection = new Zones();
		this.lithologyApp.MarkersCollection = new Markers();


		this.lithologyApp.StatusBox = $(".status-box");

		// refer to the important DOM elements.

		this.$introScreen = this.$("#intro-screen");
		this.lithologyApp.$canvas = this.$("#canvas");
		this.$canvas  = this.lithologyApp.$canvas;
		this.$displayPanels = this.$('.display-panel');

		//
		this.lithologyApp.loader = new Loader(this.lithologyApp);
		this.lithologyApp.exporter = new Exporter(this.lithologyApp);

		// Initialize the models
		this.lithologyApp.ImageOb = new ImageOb({});
		this.lithologyApp.Canvas = new Raphael(this.$canvas[0], 2000, 2000);
		// 
		this.lithologyApp.MarkersSet = this.lithologyApp.Canvas.set();
		this.lithologyApp.LithologyMarkersSet = this.lithologyApp.Canvas.set();
		this.lithologyApp.LithologyGroupMarkersSet = this.lithologyApp.Canvas.set();
		this.lithologyApp.LithologysSet = this.lithologyApp.Canvas.set();
		this.lithologyApp.LithologyGroupsSet = this.lithologyApp.Canvas.set();

		this.loadPatternsDataAndRender();
	};

	LithologyAppView.prototype.loadPatternsDataAndRender = function() {
		var self = this;
		$.get( "/pattern_manager/json/patterns.json", function(data) {
			self.lithologyApp.patternsData = data;
			self.render();
			self.listenToActionEvents();
		});
	}

	LithologyAppView.prototype.listenToActionEvents = function() {
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

	LithologyAppView.prototype.showCanvas = function() {
		this.$canvas.removeClass('hide');
		this.$introScreen.addClass('hide');
	}

	LithologyAppView.prototype.render = function() {
		this.dataExportView = new DataExportView(this.lithologyApp);

		this.cursorView = new CursorView(this.lithologyApp);


		this.imageView = new ImageView(this.lithologyApp);

		this.fileSystemView = new FileSystemView(this.lithologyApp);

		this.zonesView = new ZonesView(this.lithologyApp);
		this.markersView = new MarkersView(this.lithologyApp);

		this.lithologyColumnsView = new LithologyColumnsView(this.lithologyApp);

		this.referenceColumnSideView = new ReferenceColumnSideView(this.lithologyApp, "#reference-column-settings");

		$('.linked').scroll(function(){
			$('.linked').scrollTop($(this).scrollTop());
		});
	};


	/**

		TODO:
		- Render lithology image is temporary, will have to attach event to change lithology image.

	**/

	LithologyAppView.prototype.showSettings = function(evt) {
		var id = evt.target.getAttribute('href') + "-list";
		if ($(id).hasClass('active')) {
			$(id).removeClass('active');
			$(evt.target).removeClass('active');
			$(evt.target).parent().removeClass('active');
			this.$('#sections-panel').removeClass('active');
		} else {
			this.$('.settings-content').removeClass('active');
			this.$('.settings-links').removeClass('active');
			this.$('.lithology-settings').removeClass('active');
			$(id).addClass('active');
			$(evt.target).addClass('active');
			$(evt.target).parent().addClass('active');
			this.$('#sections-panel').addClass('active');
		}
	};

	LithologyAppView.prototype.showExportDataPanel = function(evt) {
		if (this.$exportPanel.hasClass('active')) {
		} else {
			this.dataExportView.render();
		}
	}

	LithologyAppView.prototype.exportCanvasAsImage = function() {}

	LithologyAppView.prototype.saveToLocalStorage = function() {
		this.lithologyApp.exporter.export();
		localStorage.lithologyApp = this.lithologyApp.exporter.getJSON();
	}

	LithologyAppView.prototype.loadFromLocalStorage = function() {
		this.showCanvas();
		this.lithologyApp.loader.loadFromLocalStorage();
	}


	LithologyAppView.prototype.dataDragover = function(evt) {
		var evt = evt.originalEvent;
		evt.stopPropagation();
    	evt.preventDefault();
	}


	LithologyAppView.prototype.dataDrop = function(evt) {
		var self = this;
		var evt = evt.originalEvent;
		evt.stopPropagation();
    	evt.preventDefault();
    	var file = evt.dataTransfer.files[0];
    	
    	if (file.type === "application/json") {
	    	var reader = new FileReader();
			reader.onloadend = function(e) {
				self.showCanvas();
				self.lithologyApp.loader.loadData(this.result);
			};
	    	reader.readAsText(file);	
    	}
	}


	LithologyAppView.prototype.toggleLithologys = function(evt) {		
		if ($("a[href='#add-lithology']").parent().hasClass('active')) {
			$("a[href='#add-lithology']").parent().removeClass('active');
			this.lithologyApp.enLithologys = false;
		} else {
			$("a[href='#add-lithology']").parent().addClass('active');
			this.lithologyApp.enLithologys = true;
		}
	};

	LithologyAppView.prototype.dataDragover = function(evt) {
		var evt = evt.originalEvent;
		evt.stopPropagation();
    	evt.preventDefault();
	}


	LithologyAppView.prototype.dataDrop = function(evt) {
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
				self.lithologyApp.loader.loadData(this.result);
			}
			if (ext === "txt") {
				self.lithologyApp.loader.loadTextData(this.result);
			}
			$("#loading").addClass("hide");
		};
    	reader.readAsText(file);
	}

	LithologyAppView.prototype.enableTool = function(evt) {
		var source = evt.target.getAttribute('href');

		
		if (this.markersView.enMarkers) {
			this.markersView.toggleMarkers();	
		}
		
		if (this.lithologyApp.enLithologys) {
			this.toggleLithologys();	
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
				$('#quick-save-data').foundation('reveal', 'open');
				break;
			case "#reload-data":
				$('#load-saved-data').foundation('reveal', 'open');
				break;
			case "#new-column":
				break;
			case "#add-lithology":
				this.toggleLithologys();
				break;
			default:
				break;
		}
	};

	return LithologyAppView;
});

/*-----  End of Section comment lithology  ------*/

