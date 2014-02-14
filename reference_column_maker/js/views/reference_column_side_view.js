
/*====================================================================
=            ReferenceColumnSideView is the basic view for blocks            =
====================================================================*/

define([
	"baseView",
	"referenceColumn",
	"referenceBlockColumn",
	"referenceBlockColumnView",
	"referenceColumnSideView",
	"referenceBlockMarker", "referenceBlock", "transectMarker"
	], function(
		BaseView,
		ReferenceColumn,
		ReferenceBlockColumn,
		ReferenceBlockColumnView,
		ReferenceColumnSideView,
		ReferenceBlockMarker, ReferenceBlock, TransectMarker) {

	var ReferenceColumnSideView = BaseView.extend({
		el: "#ref-col-set-list",
		classname: "ReferenceColumnSideView",
		events: {
			'keypress :input': 'updateReferenceColumnSettings',
			'keyup :input': 'updateReferenceColumnSettings',
			'click input[type=radio]': 'updateReferenceColumnSettings',
		}
	});

	ReferenceColumnSideView.prototype.template = new EJS({url: '/reference_column_maker/ejs/reference_column.ejs'});
	ReferenceColumnSideView.prototype.settingsTemplate = new EJS({url: '/reference_column_maker/ejs/reference_column_settings.ejs'});

	/*==========  Initialize block view  ==========*/

	ReferenceColumnSideView.prototype.initialize = function(app) {

		this.app = app;
		this.app.refCol = {};
		this.zones = this.app.ZonesCollection;
		this.markers = this.app.TransectMarkersCollection;


		// Initialize the reference column with default attributes.
		/**
		
			TODO:
			- Use global defaults for the top and base values.
			- Second todo item
		
		**/
		
		this.referenceColumn = new ReferenceColumn({top: 0, base: 15});
		this.app.referenceColumn = this.referenceColumn;

		this.listenTo(this.referenceColumn, 'change:columnId', this.updateReferenceColumn.bind(this));
		this.listenTo(this.referenceColumn, 'change:top', this.updateReferenceColumn.bind(this));
		this.listenTo(this.referenceColumn, 'change:base', this.updateReferenceColumn.bind(this));

		this.renderReferenceColumnCanvas();
		
		// load the column data from the json file on the server and 
		// populate the reference panel settings with the related information.
		this.loadReferenceColumnData();
	};

	ReferenceColumnSideView.prototype.renderReferenceColumnCanvas = function() {

		// render the reference panel to contain empty svg
		this.$refCanvas = $("#ref-panel");
		this.$refCanvas.html(this.template.render({}));
		this.app.refCol.$canvas = $("#ref-canvas");
		this.$canvas  = this.app.refCol.$canvas;
		this.app.refCol.Canvas = new Raphael(this.$canvas[0], 0, 0);

		// 
		this.app.refCol.MarkersSet = this.app.refCol.Canvas.set();
		this.app.refCol.BlockMarkersSet = this.app.refCol.Canvas.set();
		this.app.refCol.BlocksSet = this.app.refCol.Canvas.set();
		
	}

	ReferenceColumnSideView.prototype.loadReferenceColumnData = function() {
		var self = this;
		$.get( "/commons/json/default-reference-column-data.json", function(data) {
			self.app.refCols = data.referenceBlockColumns;
			self.render();
		});
	}

	/* Upon retrieving the data from the reference columns lying on the server populate
	the reference settings and refer to various dom elements. */

	ReferenceColumnSideView.prototype.render = function() {
		var self = this;
		self.$el.html(self.settingsTemplate.render(self.app));
		this.$topAge = this.$('input[name="top-age"]');
		this.$baseAge = this.$('input[name="base-age"]');
	};

	ReferenceColumnSideView.prototype.updateReferenceColumnSettings = function(evt) {
		var self = this;
		this.$columnId = this.$('input[name="ref-column"]:checked');
		self.referenceColumn.set({
			columnId : self.$columnId.val(),
		});

		if (evt.keyCode == transectApp.ENTER || evt.keyCode == transectApp.ESC) {
			self.referenceColumn.set({
				top      : parseFloat(self.$topAge.val()),
				base     : parseFloat(self.$baseAge.val()),
			});
		}
	}

	ReferenceColumnSideView.prototype.getColumnData = function(columnId) {
		var columnData = null;
		this.app.refCols.forEach(function(data) {
			if (data.id === columnId) {
				columnData = data;
			}
		});
		return columnData;
	}

	ReferenceColumnSideView.prototype.updateReferenceColumn = function() {
		if (this.referenceColumn.get('column')) {
			_.invoke(this.markers.toArray(), 'destroy');
			_.invoke(this.zones.toArray(), 'destroy');
			this.referenceColumn.get('column').destroy();
		}

		if (this.referenceColumn.get('top') > this.referenceColumn.get('base') || this.referenceColumn.get('columnId') == "none") {
			return;
		}

		
		var columnData = this.getColumnData(this.referenceColumn.get('columnId'));
		this.referenceColumn.set({
			column: this.loadBlockColumn(columnData)
		});

		this.resizeReferenceColumnCanvas();
	}

	ReferenceColumnSideView.prototype.loadBlockColumn = function(referenceBlockColumnData) {
		var self = this;
		referenceBlockColumnData.x = 0;
		var column = new ReferenceBlockColumn(referenceBlockColumnData);
		var columnView = new ReferenceBlockColumnView(this.app.refCol, column);
		
		self.addBlockMarkers(referenceBlockColumnData, column);
		self.updateBlockNames(referenceBlockColumnData, column);

		return column;
	}

	ReferenceColumnSideView.prototype.resizeReferenceColumnCanvas = function() {
		var width = this.referenceColumn.get('column').get('width');
		var height = this.referenceColumn.get('column').get('blockMarkes') ? this.referenceColumn.get('column').get('blockMarkes').last().get('y') + 100 : 0;
		height = Math.max(this.app.Canvas.height, height);
		this.app.refCol.Canvas.setSize(width, height);
		this.app.Canvas.setSize(this.app.Canvas.width, height);
	}

	ReferenceColumnSideView.prototype.addBlockMarkers = function(referenceBlockColumnData, column) {
		var self = this;
		var top = self.referenceColumn.get('top');
		var base = self.referenceColumn.get('base');
		referenceBlockColumnData.blockMarkers.forEach(function(referenceBlockMarkerData) {
			if (referenceBlockMarkerData.age < top || referenceBlockMarkerData.age > base) {
				return;
			}
			self.addBlockMarkerToColumn(referenceBlockMarkerData, column);
		});		
	}

	ReferenceColumnSideView.prototype.addBlockMarkerToColumn = function(referenceBlockMarkerData, column) {
		var self = this;
		var prevBlock = column.get('blockMarkers').last();
		referenceBlockMarkerData.y = prevBlock ? prevBlock.get('y') + 50 : 100;
		var referenceBlockMarker = column.get('blockMarkers').findWhere({age: referenceBlockMarkerData.age}) ||
		 new ReferenceBlockMarker({name: referenceBlockMarkerData.name, y: referenceBlockMarkerData.y, blockColumn: column, age: referenceBlockMarkerData.age}, this.app);
		column.get('blockMarkers').add(referenceBlockMarker);

		var marker = self.markers.findWhere({age: referenceBlockMarkerData.age}) || new TransectMarker(referenceBlockMarkerData);
		self.markers.add(marker);

		referenceBlockMarker.set({
			marker: marker
		});
	}

	ReferenceColumnSideView.prototype.updateBlockNames = function(referenceBlockColumnData, column) {
		var self = this;
		referenceBlockColumnData.blocks.forEach(function(referenceBlockData, index, referenceBlocksData) {
			var top = column.get('blockMarkers').findWhere({age: referenceBlockData.top.age});
			var base = column.get('blockMarkers').findWhere({age: referenceBlockData.base.age});
			if (top !== null && base !== null) {
				var referenceBlock = column.get('blocks').findWhere({top: top, base: base});
				if (referenceBlock) {
					referenceBlock.set({
						name: referenceBlockData.name,
						description: referenceBlockData.description
					});

					referenceBlock.get('settings').set({
						backgroundColor: referenceBlockData.settings.backgroundColor
					});
				}
			}
		});
	}

	return ReferenceColumnSideView;
});

/*-----  End of Section comment block  ------*/

