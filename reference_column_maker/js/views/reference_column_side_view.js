
/*====================================================================
=       ReferenceColumnSideView is the basic view for blocks         =
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
			"dragover #reference-column-box": "dataDragover",
			"drop #reference-column-box": "dataDrop",
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

		this.listenTo(this.referenceColumn, 'change:columnsData', this.render.bind(this));
		this.listenTo(this.referenceColumn, 'change:columnId', this.render.bind(this));
		this.listenTo(this.referenceColumn, 'change:top', this.render.bind(this));
		this.listenTo(this.referenceColumn, 'change:base', this.render.bind(this));

		this.renderReferenceColumnCanvas();
		
		// load the column data from the json file on the server and 
		// populate the reference panel settings with the related information.
		this.loadReferenceColumnData();
	};

	ReferenceColumnSideView.prototype.listenToActionEvents = function() {
		var self = this;
		this.$enRefPanel = $("a[href='#show-ref-panel']");
		this.$enRefPanel.click(function() {
			self.$refPanel.toggleClass("hidden");
		})
	}

	ReferenceColumnSideView.prototype.renderReferenceColumnCanvas = function() {

		// render the reference panel to contain empty svg
		this.$refPanel = $("#ref-panel");
		this.$refPanel.html(this.template.render({}));
		this.app.refCol.$canvas = $("#ref-canvas");
		this.$canvas  = this.app.refCol.$canvas;
		this.app.refCol.Canvas = new Raphael(this.$canvas[0], 0, 0);

		// 
		this.app.refCol.MarkersSet = this.app.refCol.Canvas.set();
		this.app.refCol.BlockMarkersSet = this.app.refCol.Canvas.set();
		this.app.refCol.BlocksSet = this.app.refCol.Canvas.set();

		this.listenToActionEvents();
	}

	ReferenceColumnSideView.prototype.loadReferenceColumnData = function() {
		var self = this;
		$.get( "/commons/json/default-reference-column-data.json", function(data) {
			self.referenceColumn.set({
				columnsData: data.referenceBlockColumns
			});
		});
	}

	/* Upon retrieving the data from the reference columns lying on the server populate
	the reference settings and refer to various dom elements. */

	ReferenceColumnSideView.prototype.render = function() {
		var self = this;
		self.$el.html(self.settingsTemplate.render(self.referenceColumn.toJSON()));
		this.$topAge = this.$('input[name="top-age"]');
		this.$baseAge = this.$('input[name="base-age"]');
		this.updateReferenceColumn();
	};

	ReferenceColumnSideView.prototype.updateReferenceColumnSettings = function(evt) {
		var self = this;
		this.$columnId = this.$('input[name="ref-column"]:checked');
		self.referenceColumn.set({
			columnId : self.$columnId.val(),
		});

		if (evt.keyCode == TimescaleApp.ENTER || evt.keyCode == TimescaleApp.ESC) {
			self.referenceColumn.set({
				top  : parseFloat(self.$topAge.val()),
				base : parseFloat(self.$baseAge.val()),
			});
		}
	}

	ReferenceColumnSideView.prototype.getColumnData = function(columnId) {
		var columnData = null;
		this.referenceColumn.get('columnsData').forEach(function(data) {
			if (data.id === columnId) {
				columnData = data;
			}
		});
		return columnData;
	}

	ReferenceColumnSideView.prototype.updateReferenceColumn = function(model, value, options) {
		_.invoke(this.markers.toArray(), 'destroy');
		_.invoke(this.zones.toArray(), 'destroy');
		if (this.referenceColumn.get('column')) {
			this.referenceColumn.get('column').destroy();
		}

		if (this.referenceColumn.get('top') > this.referenceColumn.get('base') || this.referenceColumn.get('columnId') === "none") {
			return;
		}
		
		var columnData = this.getColumnData(this.referenceColumn.get('columnId'));
		if (columnData) {
			this.referenceColumn.set({
				column: this.loadBlockColumn(columnData)
			});	
			this.resizeReferenceColumnCanvas();
		} else {
			this.referenceColumn.set({
				columnId: "none"
			});	
		}

	}

	ReferenceColumnSideView.prototype.loadBlockColumn = function(referenceBlockColumnData) {
		var self = this;
		referenceBlockColumnData.x = 0;
		var column = new ReferenceBlockColumn(referenceBlockColumnData);
		var columnView = new ReferenceBlockColumnView(this.app.refCol, column);
		
		self.addBlockMarkers(referenceBlockColumnData, column);
		// self.updateBlockNames(referenceBlockColumnData, column);

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
		referenceBlockColumnData.blockMarkers.forEach(function(referenceBlockMarkerData, index) {
			if (referenceBlockMarkerData.age < top || referenceBlockMarkerData.age > base) {
				return;
			}

			self.addBlockMarkerToColumn(referenceBlockMarkerData, column, index, referenceBlockColumnData);
		});		
	}

	ReferenceColumnSideView.prototype.addBlockMarkerToColumn = function(referenceBlockMarkerData, column, index, referenceBlockColumnData) {
		var self = this;
		referenceBlockMarkerData.y = column.get('blockMarkers').length > 0 ? (column.get('blockMarkers').length + 1)*50 : 50;

		var referenceBlockMarker = column.get('blockMarkers').findWhere({age: referenceBlockMarkerData.age}) ||
		 new ReferenceBlockMarker({y: referenceBlockMarkerData.y, blockColumn: column, age: referenceBlockMarkerData.age}, this.app);


		column.get('blockMarkers').add(referenceBlockMarker);

		var marker = self.markers.findWhere({age: referenceBlockMarkerData.age}) || new TransectMarker(referenceBlockMarkerData);
		self.markers.add(marker);

		referenceBlockMarker.set({
			name: referenceBlockMarkerData.name,
			marker: marker
		});
		
		marker.set({
			name: referenceBlockMarkerData.name,
		});

		if (index > 0) {
			var zone = self.zones.last();
			var referenceBlock = column.get('blocks').last();
			var referenceBlockData = referenceBlockColumnData.blocks[index - 1];

			if (zone) {
				zone.set({
					name: referenceBlockData.name,
					description: referenceBlockData.description
				});		
			}

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

	}


	// This function is pretty complex so implementing a simpler version of the function.
	ReferenceColumnSideView.prototype.updateBlockNames = function(referenceBlockColumnData, column) {
		var self = this;
		referenceBlockColumnData.blocks.forEach(function(referenceBlockData, index, referenceBlocksData) {
			var top = column.get('blockMarkers').findWhere({age: referenceBlockData.top.age});
			var base = column.get('blockMarkers').findWhere({age: referenceBlockData.base.age});
			var topMarker = self.markers.findWhere({age: referenceBlockData.top.age});
			var baseMarker = self.markers.findWhere({age: referenceBlockData.base.age});

			if (topMarker !== null && baseMarker !== null) {
				var zone = self.zones.findWhere({topMarker: topMarker, baseMarker: baseMarker});
				if (zone) {
					zone.set({
						name: referenceBlockData.name,
						description: referenceBlockData.description
					});	
				}
			}

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

	ReferenceColumnSideView.prototype.dataDragover = function(evt) {
		var evt = evt.originalEvent;
		evt.stopPropagation();
    	evt.preventDefault();
	}


	ReferenceColumnSideView.prototype.dataDrop = function(evt) {
    	$("#loading").removeClass("hide");
		var self = this;
		var evt = evt.originalEvent;
		evt.stopPropagation();
    	evt.preventDefault();
    	var file = evt.dataTransfer.files[0];
    	var ext = file.name.split(".").pop();
    	var reader = new FileReader();
		reader.onloadend = function(e) {
			if (ext === "json") {
				self.referenceColumn.set({
					columnsData: JSON.parse(this.result).referenceBlockColumns,
				});
			}
			$("#loading").addClass("hide");
		};
    	reader.readAsText(file);
	}


	return ReferenceColumnSideView;
});

/*-----  End of Section comment block  ------*/

