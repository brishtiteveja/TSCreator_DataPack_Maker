define([
    "baseView",
    "cursorView",
    "dataExportView",
    "evTreeView",
    "exporter",
    "fileSystemView",
    "imageOb",
    "imageView",
    "loader",
    "markers",
    "markersView",
    "raphael",
    "referenceColumnSideView",
    "timeline",
    "timelineView",
    "zones",
    "zonesView",
], function (
    BaseView,
    CursorView,
    DataExportView,
    EvTreeView,
    Exporter,
    FileSystemView,
    ImageOb,
    ImageView,
    Loader,
    Markers,
    MarkersView,
    Raphael,
    ReferenceColumnSideView,
    Timeline,
    TimelineView,
    Zones,
    ZonesView
) {

    var EvTreeAppView = BaseView.extend({
        el: ".container",
        classname: "EvTreeAppView",
        events: {
            'click a.evtree-settings': 'showSettings',
            'click a.maker-tools': 'enableTool',
            'click a.continue': 'showPaper',
            "dragover #data-box": "dataDragover",
            "drop #data-box": "dataDrop",
        }
    });

    /*==========  Initialize transect view  ==========*/

    EvTreeAppView.prototype.initialize = function () {

        this.app = {
            type: "evTree",
            span: true
        };


        this.app.MarkersCollection = new Markers();
        this.app.ZonesCollection = new Zones();


        this.app.StatusBox = $(".status-box");

        // refer to the important DOM elements.

        this.$introScreen = this.$("#intro-screen");
        this.app.$canvas = this.$("#canvas");
        this.app.$display = this.$("#display");
        this.$canvas = this.app.$canvas;
        this.$displayPanels = this.$('.display-panel');

        this.app.x = 0;
        this.app.y = 0;
        this.app.width = this.app.$display.width();
        this.app.height = this.app.$display.height();

        // Initialize the models

        this.app.ImageOb = new ImageOb({});
        this.app.Paper = new Raphael(this.$canvas[0], this.app.width, this.app.height);
        this.app.Paper.setViewBox(0, 0, this.app.width, this.app.height);
        this.app.timeline = new Timeline({}, this.app);
        this.initPan();

        this.app.MarkersSet = this.app.Paper.set();

        this.evTreeView = new EvTreeView(this.app);
        this.app.loader = new Loader(this.app);
        this.app.exporter = new Exporter(this.app);


        this.listenToActionEvents();

        this.render();
    };

    EvTreeAppView.prototype.initPan = function () {
        this.app.BgRect = this.app.Paper.rect(0, 0, this.app.width, this.app.height);
        this.app.BgRect.attr({
            "fill": "#ffffff",
            "fill-opacity": 1,
        });
        this.app.BgRect.drag(this.onDragMove.bind(this), this.onDragStart.bind(this), this.onDragEnd.bind(
            this));
        this.disPan();
    };

    EvTreeAppView.prototype.listenToActionEvents = function () {
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

        $("#canvas").on('dragover', this.onDragOver.bind(this));
        $("#canvas").on('drop', this.onDrop.bind(this));
    };

    EvTreeAppView.prototype.showPaper = function () {
        this.$canvas.removeClass('hide');
        this.$introScreen.addClass('hide');
    };

    EvTreeAppView.prototype.render = function () {
        this.dataExportView = new DataExportView(this.app);
        this.fileSystemView = new FileSystemView(this.app);
        this.app.fileSystemView = this.fileSystemView;
        this.cursorView = new CursorView(this.app);
        this.imageObView = new ImageView(this.app);
        this.markersView = new MarkersView(this.app);
        this.zonesView = new ZonesView(this.app);
        this.timelineView = new TimelineView(this.app.timeline, this.app);

        this.referenceColumnSideView = new ReferenceColumnSideView(this.app, "#reference-column-settings");

        $('.linked').scroll(function () {
            $('.linked').scrollTop($(this).scrollTop());
        });
    };

    /**

        TODO:
        - Render transect image is temporary, will have to attach event to change transect image.

    **/

    EvTreeAppView.prototype.showSettings = function (evt) {
        var id = evt.target.getAttribute('href') + "-list";
        if ($(id).hasClass('active')) {
            $(id).removeClass('active');
            $(evt.target).removeClass('active');
            $(evt.target).parent().removeClass('active');
            this.$('#sections-panel').removeClass('active');
        } else {
            this.$('.settings-content').removeClass('active');
            this.$('.settings-links').removeClass('active');
            this.$('.evtree-settings').removeClass('active');
            $(id).addClass('active');
            $(evt.target).addClass('active');
            $(evt.target).parent().addClass('active');
            this.$('#sections-panel').addClass('active');
        }
    };

    EvTreeAppView.prototype.showExportDataPanel = function () {
        if (this.$exportPanel.hasClass('active')) {} else {
            this.dataExportView.render();
        }
    };

    EvTreeAppView.prototype.exportPaperAsImage = function () {};

    EvTreeAppView.prototype.saveToLocalStorage = function () {
        this.app.exporter.export();
        localStorage.app = this.app.exporter.getJSON();
    };

    EvTreeAppView.prototype.loadFromLocalStorage = function () {
        // this.showPaper();
        // this.app.loader.loadFromLocalStorage();
    };


    EvTreeAppView.prototype.dataDragover = function (evt) {
        evt = evt.originalEvent;
        evt.stopPropagation();
        evt.preventDefault();
    };


    EvTreeAppView.prototype.dataDrop = function (evt) {
        var self = this;
        evt = evt.originalEvent;
        evt.stopPropagation();
        evt.preventDefault();
        var file = evt.dataTransfer.files[0];
        var ext = file.name.split(".").pop();
        var reader = new FileReader();
        reader.onloadend = function () {
            self.showPaper();
            if (ext === "json") {
                self.app.loader.loadData(this.result);
            }
            if (ext === "txt") {
                self.app.loader.loadTextData(this.result);
            }
        };
        reader.readAsText(file);
    };

    EvTreeAppView.prototype.enableTool = function (evt) {
        var source = evt.target.getAttribute('href');

        if (
            source === "#new-polygon" ||
            source === "#lock-cursor-h" ||
            source === "#lock-cursor-v"
        ) return;


        if (this.markersView.enMarkers) {
            this.markersView.toggleMarkers();
        }

        if (this.app.Cursor.get('lockH')) {
            this.cursorView.toggleHlock();
        }

        if (this.app.Cursor.get('lockV')) {
            this.cursorView.toggleVlock();
        }

        this.disPan();

        this.evTreeView.disable();

        if (this.app.CurrentNode) {
            this.app.CurrentNode.triggerUnselected();
        }
        this.app.CurrentNode = null;



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
        case "#zoom-in":
            this.zoomIn();
            break;
        case "#zoom-out":
            this.zoomOut();
            break;
        case "#pan":
            this.enPan();
            break;
        case "#tree-mode":
            this.evTreeView.enable();
            break;
        default:
            break;
        }
    };

    EvTreeAppView.prototype.zoomIn = function () {
        var vBox = this.app.Paper.canvas.viewBox.baseVal;
        this.app.BgRect.attr({
            width: vBox.width * 0.8,
            height: vBox.height * 0.8
        });

        this.app.width = Math.max(vBox.width * 0.8, this.app.width);
        this.app.height = Math.max(vBox.height * 0.8, this.app.height);
        this.app.Paper.setViewBox(vBox.x, vBox.y, vBox.width * 0.8, vBox.height * 0.8);
    };

    EvTreeAppView.prototype.zoomOut = function () {
        var vBox = this.app.Paper.canvas.viewBox.baseVal;
        this.app.BgRect.attr({
            width: vBox.width * 1.2,
            height: vBox.height * 1.2
        });

        this.app.width = Math.max(vBox.width * 1.2, this.app.width);
        this.app.height = Math.max(vBox.height * 1.2, this.app.height);
        this.app.Paper.setViewBox(vBox.x, vBox.y, vBox.width * 1.2, vBox.height * 1.2);

    };

    EvTreeAppView.prototype.enPan = function () {
        this.pan = true;
        this.app.BgRect.attr({
            "fill": "#FFCC66",
            "fill-opacity": 0.5,
        });
        this.app.BgRect.toFront();
        $("a[href='#pan']").parent().addClass('active');
    };


    EvTreeAppView.prototype.disPan = function () {
        this.pan = false;
        this.app.BgRect.attr({
            "fill": "#ffffff",
            "fill-opacity": 0,
        });
        this.app.BgRect.toBack();
        $("a[href='#pan']").parent().removeClass('active');
    };

    EvTreeAppView.prototype.onDragStart = function () {
        var vBox = this.app.Paper.canvas.viewBox.baseVal;
        this.initX = vBox.x;
        this.initY = vBox.y;
    };

    EvTreeAppView.prototype.onDragMove = function (dx, dy) {
        if (!this.pan) return;
        var vBox = this.app.Paper.canvas.viewBox.baseVal;
        this.app.BgRect.attr({
            x: this.initX - dx,
            y: this.initY - dy,
        });
        this.app.Paper.setViewBox(this.initX - dx, this.initY - dy, vBox.width, vBox.height);
    };

    EvTreeAppView.prototype.onDragEnd = function () {};

    EvTreeAppView.prototype.onDragOver = function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
    };

    EvTreeAppView.prototype.onDrop = function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
    };

    return EvTreeAppView;
});