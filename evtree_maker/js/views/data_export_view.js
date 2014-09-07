define(["baseView"], function (BaseView) {
    var DataExportView = BaseView.extend({
        el: "#export-panel",
        classname: "DataExportView",
        events: {
            'click a.show-data': "show-data"
        }
    });

    DataExportView.prototype.template = new EJS({
        url: '/evtree_maker/ejs/data_export_panel.ejs'
    });

    DataExportView.prototype.initialize = function (app) {
        this.app = app;

        this.markers = this.app.MarkersCollection;
        this.render();
        this.$canvas = $("#canvas");
    };

    DataExportView.prototype.render = function () {
        this.$el.html(this.template.render({}));
        this.$showData = this.$(".show-data");
        this.$dataTable = this.$(".data-table");
        this.$dataRaw = this.$(".data-raw");
        this.$dataJSON = this.$(".data-json");
        this.$textData = this.$("textarea[name*=lithology-columns-data-text]")[0];
        this.$textJSON = this.$("textarea[name*=lithology-columns-data-json]")[0];
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
    };

    DataExportView.prototype.renderDataInText = function () {}


    return DataExportView;
});