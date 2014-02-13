
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
	ReferenceColumnSideView.prototype.settingsTemplate = new EJS({url: '/reference_column_maker/ejs/reference_column_settings.ejs'});

	/*==========  Initialize block view  ==========*/

	ReferenceColumnSideView.prototype.initialize = function(app) {

		this.app = app;
		this.$settings = $("#ref-col-set-list");

		this.referenceColumnApp = {type : "reference-block"};
		this.referenceColumnApp.ReferenceBlockColumnsCollection = new ReferenceBlockColumns();
		this.referenceColumnApp.StatusBox = this.$(".status-box");


		// refer to the important DOM elements.

		this.$el.html(this.template.render({}));
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
			self.positionMarkersAtEquiDistance();
			self.$settings.html(self.settingsTemplate.render(self.referenceColumnApp));
		});
	}

	ReferenceColumnSideView.prototype.positionMarkersAtEquiDistance = function() {
		var self = this;
		self.referenceColumnApp.ReferenceBlockColumnsCollection.each(function(blockColumn) {
			blockColumn.get('blockMarkers').each(function(blockMarker, index, blockMarkers) {
				if (index > 0) {
					var prevMarker = blockMarkers[index - 1];
					blockMarker.set({
						y: prevMarker.get('y') + 50
					});
				} else {
					blockMarker.set({
						y: 50
					});
				}
			});
		});
	}

	return ReferenceColumnSideView;
});

/*-----  End of Section comment block  ------*/

