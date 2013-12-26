/*======================================
=            DataExportView            =
======================================*/

var DataExportView = BaseView.extend({
	el: "#export-panel",
	classname: "DataExportView",
})

DataExportView.prototype.template = new EJS({url: '/transect_maker/ejs/data_export_panel.ejs'});

DataExportView.prototype.initialize = function() {
	this.transects = transectApp.TransectsCollection;
	this.render();
}

DataExportView.prototype.render = function() {
	this.$el.html(this.template.render({transects: this.transects.toJSON()}));
}

/*-----  End of DataExportView  ------*/

