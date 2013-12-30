/*======================================
=            DataExportView            =
======================================*/

define(["baseView", "exporter"], function(BaseView, Exporter) {
	var DataExportView = BaseView.extend({
		el: "#export-panel",
		classname: "DataExportView",
		events: {
			'click a[href="#show-raw"]': "toggleDataView",
			'click a[href="#show-table"]': "toggleDataView",
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
		if (!this.isAgeSet()) {
			alert("Please set the ages for time lines!");
			return;	
		}

		this.exporter = new Exporter();
		this.transects = transectApp.TransectsCollection;
		this.$el.html(this.template.render({transects: this.transects.toJSON()}));

		this.$dataTable = this.$(".data-table");
		this.$dataRaw = this.$(".data-raw");
		this.$textData = this.$("textarea[name*=transect-data]")[0];
		this.$showTable = this.$('a[href="#show-table"]');
		this.$showRaw = this.$('a[href="#show-raw"]');
		this.$showData = this.$('a.show-data');

		this.exporter.export();
		this.renderWellsData();
		this.renderTransectsData();
		this.renderDataInText();
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

	DataExportView.prototype.toggleDataView = function(evt) {
		this.$dataTable.toggleClass("hide");
		this.$dataRaw.toggleClass("hide");
		this.$showTable.toggleClass("alert");
		this.$showRaw.toggleClass("alert");
	}

	return DataExportView;
});

/*-----  End of DataExportView  ------*/

