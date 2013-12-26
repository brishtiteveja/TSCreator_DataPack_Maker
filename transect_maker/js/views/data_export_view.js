/*======================================
=            DataExportView            =
======================================*/

var DataExportView = BaseView.extend({
	el: "#export-panel",
	classname: "DataExportView",
})

DataExportView.prototype.template = new EJS({url: '/transect_maker/ejs/data_export_panel.ejs'});
DataExportView.prototype.transectWellDataTemplate = new EJS({url: '/transect_maker/ejs/wells_data.ejs'});
DataExportView.prototype.transectPolygonMatrixTemplate = new EJS({url: '/transect_maker/ejs/transect_polygon_matrix.ejs'});
DataExportView.prototype.transectPolygonDataTemplate = new EJS({url: '/transect_maker/ejs/transect_polygon_data.ejs'});
DataExportView.prototype.transectTextDataTemplate = new EJS({url: '/transect_maker/ejs/transect_text_data.ejs'});
DataExportView.prototype.transectDataLayout = new EJS({url: '/transect_maker/ejs/transect_data_layout.ejs'});

DataExportView.prototype.initialize = function() {
	this.exporter = new Exporter();
	this.transects = transectApp.TransectsCollection;
	this.render();
}

DataExportView.prototype.render = function() {
	this.$el.html(this.template.render({transects: this.transects.toJSON()}));
	this.exporter.export();
	this.renderWellsData();
	this.renderTransectsData();
}

DataExportView.prototype.renderWellsData = function() {
	var wellsData = this.exporter.wells;
	for (var id in wellsData) {
		this.$("#" + id).html(this.transectWellDataTemplate.render(wellsData[id]));
	}
}

DataExportView.prototype.renderTransectsData = function() {
	var transects = this.exporter.transects;
	for (var id in transects) {
		this.$("#" + id).html(this.transectDataLayout.render(transects[id]));
	}
}
/*-----  End of DataExportView  ------*/

