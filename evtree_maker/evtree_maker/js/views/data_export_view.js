define(["baseView"], function (BaseView) {
    var DataExportView = BaseView.extend({
        el: "#export-panel",
        classname: "DataExportView",
        events: {
            'click a.show-data': "showData"
        }
    });

    DataExportView.prototype.template = new EJS({
        url: '/evtree_maker/ejs/data_export_panel.ejs'
    });

    DataExportView.prototype.initialize = function (app) {
        this.app = app;
        this.exporter = this.app.exporter;

        this.markers = this.app.MarkersCollection;
        this.render();
        this.$canvas = $("#canvas");
    };

    DataExportView.prototype.render = function () {
        try {
            this.exporter.export();
        } catch (e) {
            window.alert(
                "Please verify your evtree! Errors are preventing the maker from generating valid outputs."
            );
        }
        this.$el.html(this.template.render({}));
        this.$evTreeData = this.$(".evtree-data");
        this.$showData = this.$(".show-data");
        this.$dataTable = this.$(".data-table");
        this.$dataRaw = this.$(".data-raw");
        this.$dataJSON = this.$(".data-json");
        this.$textData = this.$("textarea[name*=evtree-data-text]")[0];
        this.$textJSON = this.$("textarea[name*=evtree-data-json]")[0];
        this.$showTable = this.$('a[href="#show-table"]');
        this.$showRaw = this.$('a[href="#show-raw"]');
        this.$showJSON = this.$('a[href="#show-raw"]');

        this.renderDataInText();

        this.renderDataInTable();
    };


    DataExportView.prototype.renderDataInTable = function () {
        var self = this;
    };

    DataExportView.prototype.toggleExportView = function (evt) {
        $("#loading").removeClass("hide");

        if ($("a[href='#export-data']").parent().hasClass('active')) {
            $("a[href='#export-data']").parent().removeClass('active');
            $(".display-panel").addClass('hide');
            this.$canvas.removeClass('hide');
        } else {
            $(".maker-tools").parent().removeClass('active');
            $("a[href='#export-data']").parent().addClass('active');
            $(".display-panel").addClass('hide');
            this.$el.removeClass('hide');
        }

        try {
            this.render();
        } catch (err) {}
    };

    DataExportView.prototype.renderDataInText = function () {
        this.$textData.value = this.exporter.getText();
    };

    DataExportView.prototype.showData = function (evt) {
        this.$evTreeData.addClass("hide");
        this.$showData.removeClass("alert");
        $(evt.target).addClass("alert");
        var href = $(evt.target).attr("href");

        if (href === "#show-table") {
            this.$dataTable.removeClass("hide");
        } else if (href === "#show-raw") {
            this.$dataRaw.removeClass("hide");
        } else if (href === "#show-json") {
            this.$dataJSON.removeClass("hide");
        }
    };


    return DataExportView;
});