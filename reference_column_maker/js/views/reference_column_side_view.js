
/*====================================================================
=            ReferenceColumnSideView is the basic view for blocks            =
====================================================================*/

define([
	"baseView",
	"referenceBlockColumns",
	"referenceBlockColumnsView",
	"referenceColumnLoader",
	], function(
		BaseView,
		ReferenceBlockColumns,
		ReferenceBlockColumnsView,
		ReferenceColumnLoader) {

	var ReferenceColumnSideView = BaseView.extend({
		el: "#ref-panel",
		classname: "ReferenceColumnSideView",
	});

	ReferenceColumnSideView.prototype.template = new EJS({url: '/reference_column_maker/ejs/reference_column.ejs'});

	/*==========  Initialize block view  ==========*/

	ReferenceColumnSideView.prototype.initialize = function() {

		this.referenceColumnApp = {type : "reference-block"};

		this.referenceColumnApp.ReferenceBlockColumnsCollection = new ReferenceBlockColumns();

		this.$el.html(this.template.render({}));

		this.referenceColumnApp.StatusBox = this.$(".status-box");

		// refer to the important DOM elements.

		this.referenceColumnApp.$canvas = this.$("#ref-canvas");
		this.$canvas  = this.referenceColumnApp.$canvas;

		//
		this.referenceColumnApp.loader = new ReferenceColumnLoader(this.referenceColumnApp);

		// Initialize the models
		this.referenceColumnApp.Canvas = new Raphael(this.$canvas[0], 100, 100);
		// 
		this.referenceColumnApp.MarkersSet = this.referenceColumnApp.Canvas.set();
		this.referenceColumnApp.BlockMarkersSet = this.referenceColumnApp.Canvas.set();
		this.referenceColumnApp.BlocksSet = this.referenceColumnApp.Canvas.set();
		
		this.render();
	};

	ReferenceColumnSideView.prototype.render = function() {
		this.blockColumnsView = new ReferenceBlockColumnsView(this.referenceColumnApp);
		this.loadReferenceColumnData();
	};

	ReferenceColumnSideView.prototype.loadReferenceColumnData = function() {
		var self = this;
		$.get( "/commons/json/default-reference-column-data.json", function(data) {
			self.referenceColumnApp.loader.loadData(data);
		});
	}



	return ReferenceColumnSideView;
});

/*-----  End of Section comment block  ------*/

