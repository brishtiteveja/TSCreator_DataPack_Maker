/*======================================
=            DataImportView            =
======================================*/

define(["baseView"], function(BaseView) {
	var DataImportView = BaseView.extend({
		el: ".container",
		classname: "DataImportView",
	});

	DataImportView.prototype.initialize = function() {
		this.$dataStatus = this.$(".data-status");
	}


	return DataImportView
});

/*-----  End of DataImportView  ------*/