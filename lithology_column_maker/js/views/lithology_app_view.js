define([
    "raphael",
    "baseView",
    "cursorView",
    "fileSystemView",
    "markers",
    "markersView",
    "zones",
    "zonesView",
    "lithologyMarkers",
    "lithologyColumns",
    "lithologyColumnsView",
    "dataExportView",
    "loader",
    "exporter",
    "referenceColumnSideView",
    "imageView",
    "imageOb",
    "defaultOb",
    "defaultView",
    "rulerView",
    "lithology2dView"
], function (
    Raphael,
    BaseView,
    CursorView,
    FileSystemView,
    Markers,
    MarkersView,
    Zones,
    ZonesView,
    LithologyMarkers,
    LithologyColumns,
    LithologyColumnsView,
    DataExportView,
    Loader,
    Exporter,
    ReferenceColumnSideView,
    ImageView,
    ImageOb,
    DefaultOb,
    DefaultView,
    RulerView,
    Lithology2dView
) {

    var LithologyAppView = BaseView.extend({
        el: ".container",
        classname: "LithologyAppView",
        events: {
            'click a.lithology-settings': 'showSettings',
            'click a.maker-tools': 'enableTool',
            'click a.continue': 'showPaper',
            "dragover .data-dropbox": "dataDragover",
            "drop .data-dropbox": "dataDrop",
        }
    });

    /*==========  Initialize lithology view  ==========*/

    LithologyAppView.prototype.initialize = function () {

        this.app = {
            type: "lithology"
        };

		this.draggingProject = false;

        this.app.LithologyColumnsCollection = new LithologyColumns();
        this.app.LithologyMarkersCollection = new LithologyMarkers();
        this.app.ZonesCollection = new Zones();
        this.app.MarkersCollection = new Markers();


        this.app.StatusBox = $(".status-box");

        // refer to the important DOM elements.

        this.$introScreen = this.$(".introduction");
        this.app.$canvas = this.$("#canvas");
        this.$canvas = this.app.$canvas;
        this.$displayPanels = this.$('.display-panel');

        this.loadPatternsDataAndRender();

        // Initialize the models
        this.app.ImageOb = new ImageOb({});
        this.app.defaultOb = new DefaultOb({});
        this.app.Paper = new Raphael(this.$canvas[0], 2000, 2000);
        //
        this.app.MarkersSet = this.app.Paper.set();
        this.app.LithologyMarkersSet = this.app.Paper.set();
        this.app.LithologyGroupMarkersSet = this.app.Paper.set();
        this.app.LithologysSet = this.app.Paper.set();
        this.app.LithologyGroupsSet = this.app.Paper.set();


        this.lithology2dView = new Lithology2dView(this.app);

        this.app.lithology2dView = this.lithology2dView;

        // This should come after lithology2dview as the app also inludes it.
        this.app.loader = new Loader(this.app);
        this.app.exporter = new Exporter(this.app);


        $('.linked').scroll(function () {
            $('.linked').scrollTop($(this).scrollTop());
        });
    };

    LithologyAppView.prototype.loadPatternsDataAndRender = function () {
        var self = this;
        $.get("../../pattern_manager/json/patterns.json", function (data) {
            self.app.patternsData = data;
            self.render();
            self.listenToActionEvents();
        });
    }

    LithologyAppView.prototype.listenToActionEvents = function () {
        var self = this;
        $(".close-reveal-modal").click(function (evt) {
            $(evt.target).parent().foundation('reveal', 'close')
        });

        $('a[href=#continue-load-from-local-storage]').click(function (evt) {
            $(evt.target).parent().foundation('reveal', 'close');
        });

        $('a[href=#continue-save-to-local-storage]').click(function (evt) {
            $(evt.target).parent().foundation('reveal', 'close');
        });

        $(document).on('close.fndtn.reveal', '[data-reveal]', function () {
            switch (this.id) {
            case "load-saved-data":
                self.loadFromLocalStorage();
                break;
            case "save-to-local-storage":
                self.saveToLocalStorage();
                break;
            case "quick-save-data":
                self.saveToLocalStorage();
                break;
            default:
                break;
            }
        });
        $(document).on('closed.fndtn.reveal', '[data-reveal]', function () {});
    }

    LithologyAppView.prototype.showPaper = function () {
		if (this.draggingProject == false) {
    		var projectName = prompt("Please input your Project Name", "") 
    		if (projectName != null)
    		{
    			this.app.projectName = projectName;
    			this.$canvas.removeClass('hide');
    			this.$introScreen.addClass('hide');
    			this.$introScreen.hide();
    		} 
		} 
		else 
		{
    		this.$canvas.removeClass('hide');
    		this.$introScreen.addClass('hide');
    		this.$introScreen.hide();
		}
    }

    LithologyAppView.prototype.render = function () {

        this.rulerView = new RulerView(this.app);

        this.defaultView = new DefaultView(this.app);
        this.dataExportView = new DataExportView(this.app);

        this.cursorView = new CursorView(this.app);


        this.imageView = new ImageView(this.app);

        this.fileSystemView = new FileSystemView(this.app);

        this.zonesView = new ZonesView(this.app);
        this.markersView = new MarkersView(this.app);

        this.lithologyColumnsView = new LithologyColumnsView(this.app);

        this.referenceColumnSideView = new ReferenceColumnSideView(this.app, "#reference-column-settings");

    };


    /**

		TODO:
		- Render lithology image is temporary, will have to attach event to change lithology image.

	**/

    LithologyAppView.prototype.showSettings = function (evt) {
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

    LithologyAppView.prototype.showExportDataPanel = function (evt) {
        if (this.$exportPanel.hasClass('active')) {} else {
            this.dataExportView.render();
        }
    }

    LithologyAppView.prototype.exportPaperAsImage = function () {}

    LithologyAppView.prototype.saveToLocalStorage = function () {
        this.app.exporter.export();
        localStorage.lithologyApp = this.app.exporter.getJSON();
    }

    LithologyAppView.prototype.loadFromLocalStorage = function () {
        this.showPaper();
        this.app.loader.loadFromLocalStorage();
    }


    LithologyAppView.prototype.toggleLithologys = function (evt) {
        if ($("a[href='#add-lithology']").parent().hasClass('active')) {
            $("a[href='#add-lithology']").parent().removeClass('active');
            this.app.enLithologys = false;
        } else {
            $("a[href='#add-lithology']").parent().addClass('active');
            this.app.enLithologys = true;
        }
    };

    LithologyAppView.prototype.dataDragover = function (evt) {
		this.draggingProject = true;
        var evt = evt.originalEvent;
        evt.stopPropagation();
        evt.preventDefault();
    }


    LithologyAppView.prototype.dataDrop = function (evt) {
        var self = this;
        var evt = evt.originalEvent;
        evt.stopPropagation();
        evt.preventDefault();
        var file = evt.dataTransfer.files[0];
        var ext = file.name.split(".").pop();
        var reader = new FileReader();
        reader.onloadend = function (e) {
            self.showPaper();
            if (ext === "json") {
                self.app.loader.loadData(this.result);
            }
            if (ext === "txt") {
                self.app.loader.loadTextData(this.result);
            }
        };
        reader.readAsText(file);
    }

    LithologyAppView.prototype.toggleMapView = function () {

        if ($("a[href='#show-map']").parent().hasClass('active')) {
            $("a[href='#show-map']").parent().removeClass('active');
            $(".display-panel").addClass('hide');
            $("#map").addClass('hide');
            this.$canvas.removeClass('hide');
        } else {
            $(".maker-tools").parent().removeClass('active');
            $("a[href='#show-map']").parent().addClass('active');
            $(".display-panel").addClass('hide');
            $("#map").removeClass('hide');
        }

    }

    LithologyAppView.prototype.enableTool = function (evt) {
        var source = evt.target.getAttribute('href');


        if (this.markersView.enMarkers) {
            this.markersView.toggleMarkers();
        }

        if (this.app.enLithologys) {
            this.toggleLithologys();
        }

        switch (source) {
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
        case "#show-map":
            this.toggleMapView();
            break;
        default:
            break;
        }
    };

    return LithologyAppView;
});
