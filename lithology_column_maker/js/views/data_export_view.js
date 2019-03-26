/*======================================
=            DataExportView            =
======================================*/

define(["baseView"], function (BaseView) {

    var DataExportView = BaseView.extend({
        el: "#export-panel",
        classname: "DataExportView",
        events: {
            'click a.show-data': "showData"
        }
    });

    DataExportView.prototype.template = new EJS({
        url: '../../lithology_column_maker/ejs/data_export_panel.ejs'
    });
    DataExportView.prototype.lithologyColumnDataTemplate = new EJS({
        url: '../../lithology_column_maker/ejs/lithology_column_data.ejs'
    });

    DataExportView.prototype.initialize = function (app) {
        this.app = app;
        this.exporter = this.app.exporter;

        this.markers = this.app.MarkersCollection;
        this.lithologyColumns = this.app.LithologyColumnsCollection;
        this.render();
        this.$canvas = $("#canvas");
    }

    DataExportView.prototype.render = function () {
        this.exporter.export();
        this.$el.html(this.template.render({
            lithologyColumns: this.lithologyColumns.toJSON()
        }));

        this.$lithologyColumnsData = this.$(".lithology-columns-data");
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

    }

    DataExportView.prototype.renderDataInTable = function () {
        var self = this;
        this.lithologyColumns.each(function (lithologyColumn) {
            var id = lithologyColumn.id;
            self.$("#" + id).html(self.lithologyColumnDataTemplate.render(lithologyColumn.toJSON()))
        });
    }

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
			$('.introduction').hide();
        }

        try {
            this.render();
            $("#loading").addClass("hide");
        } catch (err) {
            $("#loading").addClass("hide");
        }
    }

    DataExportView.prototype.renderDataInText = function () {
        this.$textData.value = this.exporter.getText();
    }


    DataExportView.prototype.showData = function (evt) {
        this.$lithologyColumnsData.addClass("hide");
        this.$showData.removeClass("alert");
        $(evt.target).addClass("alert");
        var href = $(evt.target).attr("href");

        if (href === "#show-table") {
            this.$dataTable.removeClass("hide");
        } else if (href === "#show-raw") {
            this.$dataRaw.removeClass("hide");
        } else if (href === "#show-json") {
            this.$dataJSON.removeClass("hide");
	} else if (href === "#send-to-master-maker") {
	    localStorage.setItem("LithologyDatapack", this.exporter.getText());
	    window.opener.focus();
	    window.close();
	}
    }

    return DataExportView;
});

/*-----  End of DataExportView  ------*/
