/*======================================
=            DataExportView            =
======================================*/

define(["baseView"], function(BaseView) {
	var DataExportView = BaseView.extend({
		el: "#export-panel",
		classname: "DataExportView",
		events: {
			'click a.show-data': "showData"
		}
	})

	DataExportView.prototype.template = new EJS({url: '/transect_maker/ejs/data_export_panel.ejs'});
	DataExportView.prototype.transectWellDataTemplate = new EJS({url: '/transect_maker/ejs/wells_data.ejs'});
	DataExportView.prototype.transectDataLayout = new EJS({url: '/transect_maker/ejs/transect_data_layout.ejs'});

	DataExportView.prototype.initialize = function() {
		this.markers = transectApp.TransectMarkersCollection;
		this.polygons = transectApp.PolygonsCollection;
		this.render();
		this.$exportPanel = $("#export-panel");
		this.$canvas = $("#canvas");
	}

	DataExportView.prototype.render = function() {
		this.exporter = transectApp.exporter;
		this.transects = transectApp.TransectsCollection;
		this.$el.html(this.template.render({transects: this.transects.toJSON()}));

		this.$transectData = this.$(".transect-data");
		this.$showData = this.$(".show-data");
		this.$dataTable = this.$(".data-table");
		this.$dataRaw = this.$(".data-raw");
		this.$dataJSON = this.$(".data-json");
		this.$textData = this.$("textarea[name*=transect-data-text]")[0];
		this.$textJSON = this.$("textarea[name*=transect-data-json]")[0];
		this.$showTable = this.$('a[href="#show-table"]');
		this.$showRaw = this.$('a[href="#show-raw"]');
		this.$showJSON = this.$('a[href="#show-raw"]');

		this.exporter.export();
		this.renderWellsData();
		this.renderTransectsData();
		this.renderDataInText();
		this.renderDataInJSON();
	}

	DataExportView.prototype.isAgeSet = function() {
		for (var i=0; i<this.markers.length; i++) {
			var marker = this.markers.at(i);
			if (marker.get('age') == null) {
				return false;
			}
		}
		return true;
	}

	DataExportView.prototype.renderWellsData = function() {
		var wellsData = this.exporter.wellsData;
		for (var id in wellsData) {
			this.$("#" + id).html(this.transectWellDataTemplate.render(wellsData[id]));
		}
	}

	DataExportView.prototype.renderTransectsData = function() {
		var transectsData = this.exporter.transectsData;
		for (var id in transectsData) {
			this.$("#" + id).html(this.transectDataLayout.render(transectsData[id]));
		}
	}

	DataExportView.prototype.renderDataInText = function() {
		this.$textData.value = this.exporter.getText();
	}

	DataExportView.prototype.renderDataInJSON = function() {
		this.$textJSON.value = this.exporter.getJSON();
	}

	DataExportView.prototype.toggleExportView = function(evt) {
		if ($("a[href='#export-data']").parent().hasClass('active')) {
			$("a[href='#export-data']").parent().removeClass('active');
			this.$exportPanel.removeClass('active');
			this.$canvas.removeClass('hide');
		} else {
			$("a[href='#export-data']").parent().addClass('active');
			this.$exportPanel.addClass('active');
			this.$canvas.addClass('hide');
		}
		this.render();
	};

	DataExportView.prototype.showData = function(evt) {
		this.$transectData.addClass("hide");
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
	}

	return DataExportView;
});

/*-----  End of DataExportView  ------*/
