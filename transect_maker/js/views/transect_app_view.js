define([
    "raphael",
    "baseView",
    "cursorView",
    "transectsView",
    "imageView",
    "markersView",
    "transectWellsView",
    "transectTextsView",
    "zonesView",
    "polygonsView",
    "dataImportView",
    "dataExportView",
    "fileSystemView",
    "imageOb",
    "loader",
    "exporter",
    "transects",
    "transectTexts",
    "polygons",
    "lines",
    "points",
    "zones",
    "transectWells",
    "markers",
    "referenceColumnSideView",
], function (
    Raphael,
    BaseView,
    CursorView,
    TransectsView,
    ImageView,
    MarkersView,
    TransectWellsView,
    TransectTextsView,
    ZonesView,
    PolygonsView,
    DataImportView,
    DataExportView,
    FileSystemView,
    ImageOb,
    Loader,
    Exporter,
    Transects,
    TransectTexts,
    Polygons,
    Lines,
    Points,
    Zones,
    TransectWells,
    Markers,
    ReferenceColumnSideView) {

    var TransectAppView = BaseView.extend({
        el: ".container",
        classname: "TransectAppView",
        events: {
            'click a.transect-settings': 'showSettings',
            'click a.maker-tools': 'enableTool',
            'click a.continue': 'showPaper',
            "dragover #data-box": "dataDragover",
            "drop #data-box": "dataDrop",
        }
    });

    /*==========  Initialize transect view  ==========*/

    TransectAppView.prototype.initialize = function () {

        this.transectApp = {
            type: "transect",
            span: true
        };

        this.transectApp.TransectsCollection = new Transects();
        this.transectApp.TransectTextsCollection = new TransectTexts();
        this.transectApp.PolygonsCollection = new Polygons();
        this.transectApp.LinesCollection = new Lines();
        this.transectApp.PointsCollection = new Points();
        this.transectApp.ZonesCollection = new Zones();
        this.transectApp.TransectWellsCollection = new TransectWells();
        this.transectApp.MarkersCollection = new Markers();

        this.transectApp.CurrentPolygon = null;


        this.transectApp.StatusBox = $(".status-box");

        // refer to the important DOM elements.

        this.$introScreen = this.$("#intro-screen");
        this.transectApp.$canvas = this.$("#canvas");
        this.transectApp.$display = this.$("#display");
        this.$canvas = this.transectApp.$canvas;
        this.$displayPanels = this.$('.display-panel');

        this.transectApp.x = 0;
        this.transectApp.y = 0;
        this.transectApp.width = this.transectApp.$display.width();
        this.transectApp.height = this.transectApp.$display.height();

        // Initialize the models

        this.transectApp.ImageOb = new ImageOb({});
        this.transectApp.Paper = new Raphael(this.$canvas[0], this.transectApp.width, this.transectApp.height);
        this.transectApp.Paper.setViewBox(0, 0, this.transectApp.width, this.transectApp.height);
        this.initPan();

        this.transectApp.TextsSet = this.transectApp.Paper.set();
        this.transectApp.MarkersSet = this.transectApp.Paper.set();
        this.transectApp.WellsSet = this.transectApp.Paper.set();
        this.transectApp.PointsSet = this.transectApp.Paper.set();
        this.transectApp.LinesSet = this.transectApp.Paper.set();
        this.transectApp.PolygonsSet = this.transectApp.Paper.set();


        this.transectApp.loader = new Loader(this.transectApp);
        this.transectApp.exporter = new Exporter(this.transectApp);

        this.listenToActionEvents();

        this.render();
    };

    TransectAppView.prototype.initPan = function () {
        this.transectApp.BgRect = this.transectApp.Paper.rect(0, 0, this.transectApp.width, this.transectApp.height);
        this.transectApp.BgRect.attr({
            "fill": "#ffffff",
            "fill-opacity": 1,
        });
        this.transectApp.BgRect.drag(this.onDragMove.bind(this), this.onDragStart.bind(this), this.onDragEnd.bind(
            this));
        this.disPan();
    }

    TransectAppView.prototype.listenToActionEvents = function () {
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
            default:
                break;
            }
        });
        $(document).on('closed.fndtn.reveal', '[data-reveal]', function () {});
    }

    TransectAppView.prototype.showPaper = function () {
        this.$canvas.removeClass('hide');
        this.$introScreen.addClass('hide');
    }

    TransectAppView.prototype.render = function () {
        this.dataImportView = new DataImportView(this.transectApp);
        this.dataExportView = new DataExportView(this.transectApp);
        this.fileSystemView = new FileSystemView(this.transectApp);


        this.cursorView = new CursorView(this.transectApp);

        this.imageObView = new ImageView(this.transectApp);

        this.markersView = new MarkersView(this.transectApp);
        this.zonesView = new ZonesView(this.transectApp);

        this.transectWellsView = new TransectWellsView(this.transectApp);
        this.transectsView = new TransectsView(this.transectApp);

        this.transectTextsView = new TransectTextsView(this.transectApp);

        this.polygonsView = new PolygonsView(this.transectApp);

        this.referenceColumnSideView = new ReferenceColumnSideView(this.transectApp, "#reference-column-settings");

        $('.linked').scroll(function () {
            $('.linked').scrollTop($(this).scrollTop());
        });
    };

    /**

		TODO:
		- Render transect image is temporary, will have to attach event to change transect image.

	**/

    TransectAppView.prototype.showSettings = function (evt) {
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

    TransectAppView.prototype.showExportDataPanel = function (evt) {
        if (this.$exportPanel.hasClass('active')) {} else {
            this.dataExportView.render();
        }
    }

    TransectAppView.prototype.exportPaperAsImage = function () {}

    TransectAppView.prototype.saveToLocalStorage = function () {
        this.transectApp.exporter.export();
        localStorage.transectApp = this.transectApp.exporter.getJSON();
    }

    TransectAppView.prototype.loadFromLocalStorage = function () {
        this.showPaper();
        this.transectApp.loader.loadFromLocalStorage();
    }


    TransectAppView.prototype.dataDragover = function (evt) {
        var evt = evt.originalEvent;
        evt.stopPropagation();
        evt.preventDefault();
    }


    TransectAppView.prototype.dataDrop = function (evt) {
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
                self.transectApp.loader.loadData(this.result);
            }
        };
        reader.readAsText(file);
    }

    TransectAppView.prototype.enableTool = function (evt) {
        var source = evt.target.getAttribute('href');

        if (
            source === "#new-polygon" ||
            source === "#lock-cursor-h" ||
            source === "#lock-cursor-v"
        ) return;


        if (this.markersView.enMarkers) {
            this.markersView.toggleMarkers();
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

        this.disPan();


        switch (source) {
        case "#add-marker":
            this.markersView.toggleMarkers();
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
            $('#quick-save-data').foundation('reveal', 'open');
            // this.saveToLocalStorage();
            break;
        case "#reload-data":
            $('#load-saved-data').foundation('reveal', 'open');
            // this.loadFromLocalStorage();
            break;
        case "#zoom-in":
            this.zoomIn();
            break;
        case "#zoom-out":
            this.zoomOut();
            break;
        case "#pan":
            this.enPan();
            break;
        default:
            break;
        }
    };

    TransectAppView.prototype.zoomIn = function () {
        var vBox = this.transectApp.Paper.canvas.viewBox.baseVal;
        this.transectApp.BgRect.attr({
            width: vBox.width * 0.8,
            height: vBox.height * 0.8
        });

        this.transectApp.width = Math.max(vBox.width * 0.8, this.transectApp.width);
        this.transectApp.height = Math.max(vBox.height * 0.8, this.transectApp.height);
        this.transectApp.Paper.setViewBox(vBox.x, vBox.y, vBox.width * 0.8, vBox.height * 0.8);
    }

    TransectAppView.prototype.zoomOut = function () {
        var vBox = this.transectApp.Paper.canvas.viewBox.baseVal;
        this.transectApp.BgRect.attr({
            width: vBox.width * 1.2,
            height: vBox.height * 1.2
        });

        this.transectApp.width = Math.max(vBox.width * 1.2, this.transectApp.width);
        this.transectApp.height = Math.max(vBox.height * 1.2, this.transectApp.height);
        this.transectApp.Paper.setViewBox(vBox.x, vBox.y, vBox.width * 1.2, vBox.height * 1.2);

    }

    TransectAppView.prototype.enPan = function () {
        this.pan = true;
        this.transectApp.BgRect.attr({
            "fill": "#FFCC66",
            "fill-opacity": 0.5,
        });
        this.transectApp.BgRect.toFront();
        $("a[href='#pan']").parent().addClass('active');
    }


    TransectAppView.prototype.disPan = function () {
        this.pan = false;
        this.transectApp.BgRect.attr({
            "fill": "#ffffff",
            "fill-opacity": 1,
        });
        this.transectApp.BgRect.toBack();
        $("a[href='#pan']").parent().removeClass('active');
    }

    TransectAppView.prototype.onDragStart = function (x, y, evt) {
        var vBox = this.transectApp.Paper.canvas.viewBox.baseVal;
        this.initX = vBox.x;
        this.initY = vBox.y;
    }

    TransectAppView.prototype.onDragMove = function (dx, dy, x, y, evt) {
        if (!this.pan) return;
        var vBox = this.transectApp.Paper.canvas.viewBox.baseVal;
        this.transectApp.BgRect.attr({
            x: this.initX - dx,
            y: this.initY - dy,
        })
        this.transectApp.Paper.setViewBox(this.initX - dx, this.initY - dy, vBox.width, vBox.height);
    }

    TransectAppView.prototype.onDragEnd = function (evt) {}

    return TransectAppView;
});
