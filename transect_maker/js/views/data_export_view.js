/*======================================
=            DataExportView            =
======================================*/

var DataExportView = BaseView.extend({
	el: "#export-panel",
	classname: "DataExportView",
})

DataExportView.prototype.template = new EJS({url: '/transect_maker/ejs/data_export_panel.ejs'});
DataExportView.prototype.transectWellDataTemplate = new EJS({url: '/transect_maker/ejs/wells_data.ejs'});
DataExportView.prototype.transectDataLayout = new EJS({url: '/transect_maker/ejs/transect_data_layout.ejs'});

DataExportView.prototype.initialize = function() {
	this.render();
	this.$exportPanel = $("#export-panel");
	this.$canvas = $("#canvas");
}

DataExportView.prototype.render = function() {
	this.exporter = new Exporter();
	this.transects = transectApp.TransectsCollection;
	this.$el.html(this.template.render({transects: this.transects.toJSON()}));
	this.exporter.export();
	this.renderWellsData();
	this.renderTransectsData();
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

DataExportView.prototype.enableDataPanel = function() {
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
		this.render();
	}
};
/*-----  End of DataExportView  ------*/

