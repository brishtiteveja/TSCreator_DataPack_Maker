define([
    "baseView",
    "cursorView",
    "evTreeView",
    "fileSystemView",
    "imageOb",
    "imageView",
    "markers",
    "markersView",
    "raphael",
    "referenceColumnSideView",
    "timeline",
    "timelineView",
    "zones",
    "zonesView"
], function (
    BaseView,
    CursorView,
    EvTreeView,
    FileSystemView,
    ImageOb,
    ImageView,
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

        this.evTreeApp = {
            type: "evTree",
            span: true
        };


        this.evTreeApp.MarkersCollection = new Markers();
        this.evTreeApp.ZonesCollection = new Zones();


        this.evTreeApp.StatusBox = $(".status-box");

        // refer to the important DOM elements.

        this.$introScreen = this.$("#intro-screen");
        this.evTreeApp.$canvas = this.$("#canvas");
        this.evTreeApp.$display = this.$("#display");
        this.$canvas = this.evTreeApp.$canvas;
        this.$displayPanels = this.$('.display-panel');

        this.evTreeApp.x = 0;
        this.evTreeApp.y = 0;
        this.evTreeApp.width = this.evTreeApp.$display.width();
        this.evTreeApp.height = this.evTreeApp.$display.height();

        // Initialize the models

        this.evTreeApp.ImageOb = new ImageOb({});
        this.evTreeApp.Paper = new Raphael(this.$canvas[0], this.evTreeApp.width, this.evTreeApp.height);
        this.evTreeApp.Paper.setViewBox(0, 0, this.evTreeApp.width, this.evTreeApp.height);
        this.evTreeApp.timeline = new Timeline({}, this.evTreeApp);
        this.initPan();

        this.evTreeApp.MarkersSet = this.evTreeApp.Paper.set();

        this.listenToActionEvents();

        this.render();
    };

    EvTreeAppView.prototype.initPan = function () {
        this.evTreeApp.BgRect = this.evTreeApp.Paper.rect(0, 0, this.evTreeApp.width, this.evTreeApp.height);
        this.evTreeApp.BgRect.attr({
            "fill": "#ffffff",
            "fill-opacity": 1,
        });
        this.evTreeApp.BgRect.drag(this.onDragMove.bind(this), this.onDragStart.bind(this), this.onDragEnd.bind(
            this));
        this.disPan();
    }

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
            default:
                break;
            }
        });
        $(document).on('closed.fndtn.reveal', '[data-reveal]', function () {});

        $("#canvas").on('dragover', this.onDragOver.bind(this));
        $("#canvas").on('drop', this.onDrop.bind(this));
    }

    EvTreeAppView.prototype.showPaper = function () {
        this.$canvas.removeClass('hide');
        this.$introScreen.addClass('hide');
    }

    EvTreeAppView.prototype.render = function () {
        this.fileSystemView = new FileSystemView(this.evTreeApp);
        this.evTreeApp.fileSystemView = this.fileSystemView;
        this.cursorView = new CursorView(this.evTreeApp);
        this.imageObView = new ImageView(this.evTreeApp);
        this.markersView = new MarkersView(this.evTreeApp);
        this.zonesView = new ZonesView(this.evTreeApp);
        this.evTreeView = new EvTreeView(this.evTreeApp);
        this.timelineView = new TimelineView(this.evTreeApp.timeline, this.evTreeApp)

        this.referenceColumnSideView = new ReferenceColumnSideView(this.evTreeApp, "#reference-column-settings");

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

    EvTreeAppView.prototype.showExportDataPanel = function (evt) {
        if (this.$exportPanel.hasClass('active')) {} else {
            this.dataExportView.render();
        }
    }

    EvTreeAppView.prototype.exportPaperAsImage = function () {}

    EvTreeAppView.prototype.saveToLocalStorage = function () {
        // this.evTreeApp.exporter.export();
        // localStorage.evTreeApp = this.evTreeApp.exporter.getJSON();
    }

    EvTreeAppView.prototype.loadFromLocalStorage = function () {
        // this.showPaper();
        // this.evTreeApp.loader.loadFromLocalStorage();
    }


    EvTreeAppView.prototype.dataDragover = function (evt) {
        var evt = evt.originalEvent;
        evt.stopPropagation();
        evt.preventDefault();
    }


    EvTreeAppView.prototype.dataDrop = function (evt) {
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
                // self.evTreeApp.loader.loadData(this.result);
            }
        };
        reader.readAsText(file);
    }

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

        if (this.evTreeApp.Cursor.get('lockH')) {
            this.cursorView.toggleHlock();
        }

        if (this.evTreeApp.Cursor.get('lockV')) {
            this.cursorView.toggleVlock();
        }

        this.disPan();

        this.evTreeView.disable();

        if (this.evTreeApp.CurrentNode) {
            this.evTreeApp.CurrentNode.triggerUnselected();
        }
        this.evTreeApp.CurrentNode = null;



        switch (source) {
        case "#add-marker":
            this.markersView.toggleMarkers();
            break;
        case "#export-data":
            // this.dataExportView.toggleExportView();
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
        var vBox = this.evTreeApp.Paper.canvas.viewBox.baseVal;
        this.evTreeApp.BgRect.attr({
            width: vBox.width * 0.8,
            height: vBox.height * 0.8
        });

        this.evTreeApp.width = Math.max(vBox.width * 0.8, this.evTreeApp.width);
        this.evTreeApp.height = Math.max(vBox.height * 0.8, this.evTreeApp.height);
        this.evTreeApp.Paper.setViewBox(vBox.x, vBox.y, vBox.width * 0.8, vBox.height * 0.8);
    }

    EvTreeAppView.prototype.zoomOut = function () {
        var vBox = this.evTreeApp.Paper.canvas.viewBox.baseVal;
        this.evTreeApp.BgRect.attr({
            width: vBox.width * 1.2,
            height: vBox.height * 1.2
        });

        this.evTreeApp.width = Math.max(vBox.width * 1.2, this.evTreeApp.width);
        this.evTreeApp.height = Math.max(vBox.height * 1.2, this.evTreeApp.height);
        this.evTreeApp.Paper.setViewBox(vBox.x, vBox.y, vBox.width * 1.2, vBox.height * 1.2);

    }

    EvTreeAppView.prototype.enPan = function () {
        this.pan = true;
        this.evTreeApp.BgRect.attr({
            "fill": "#FFCC66",
            "fill-opacity": 0.5,
        });
        this.evTreeApp.BgRect.toFront();
        $("a[href='#pan']").parent().addClass('active');
    }


    EvTreeAppView.prototype.disPan = function () {
        this.pan = false;
        this.evTreeApp.BgRect.attr({
            "fill": "#ffffff",
            "fill-opacity": 0,
        });
        this.evTreeApp.BgRect.toBack();
        $("a[href='#pan']").parent().removeClass('active');
    }

    EvTreeAppView.prototype.onDragStart = function (x, y, evt) {
        var vBox = this.evTreeApp.Paper.canvas.viewBox.baseVal;
        this.initX = vBox.x;
        this.initY = vBox.y;
    }

    EvTreeAppView.prototype.onDragMove = function (dx, dy, x, y, evt) {
        if (!this.pan) return;
        var vBox = this.evTreeApp.Paper.canvas.viewBox.baseVal;
        this.evTreeApp.BgRect.attr({
            x: this.initX - dx,
            y: this.initY - dy,
        });
        this.evTreeApp.Paper.setViewBox(this.initX - dx, this.initY - dy, vBox.width, vBox.height);
    }

    EvTreeAppView.prototype.onDragEnd = function (evt) {}

    EvTreeAppView.prototype.onDragOver = function(evt) {
        evt.stopPropagation();
        evt.preventDefault();
    };

    EvTreeAppView.prototype.onDrop = function(evt) {
        evt.stopPropagation();
        evt.preventDefault();
    };

    return EvTreeAppView;
});