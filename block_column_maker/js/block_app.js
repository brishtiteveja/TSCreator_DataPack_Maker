requirejs.config({
	paths: {

		// Base components
		baseView: "/commons/js/views/base_view",
		baseModel: "/commons/js/models/base_model",
		baseCollection: "/commons/js/collections/base_collection",

		// App
		app: "/commons/js/models/app",


		// Settings
		settings: "/commons/js/models/settings",

		// Cursor
		cursorView: "/commons/js/views/cursor_view",
		cursor: "/commons/js/models/cursor",

		// Markers
		markersView: "/commons/js/views/markers_view",
		markerView: "/commons/js/views/marker_view",
		marker: "/commons/js/models/marker",
		markers: "/commons/js/collections/markers",
		
		// Zones
		zoneView: "/commons/js/views/zone_view",
		zonesView: "/commons/js/views/zones_view",
		zone: "/commons/js/models/zone",
		zones: "/commons/js/collections/zones",

		// Data Loader
		loader: "/block_column_maker/js/utils/loader",
		
		// Data Exporter
		exporter: "/block_column_maker/js/utils/exporter",
		dataExportView: "/block_column_maker/js/views/data_export_view",

		// 
		block: "/block_column_maker/js/models/block",
		blocks: "/block_column_maker/js/collections/blocks",
		blockMarker: "/block_column_maker/js/models/block_marker",
		blockMarkers: "/block_column_maker/js/collections/block_markers",
		blockColumn: "/block_column_maker/js/models/block_column",
		blockColumns: "/block_column_maker/js/collections/block_columns",
		blockView: "/block_column_maker/js/views/block_view",
		blockMarkerView: "/block_column_maker/js/views/block_marker_view",
		blockColumnView: "/block_column_maker/js/views/block_column_view",
		blockColumnsView: "/block_column_maker/js/views/block_columns_view",

		// Libraries
		polyK: "/commons/js/lib/polyK",

		// File System
		file: "/file_system/js/models/file",
		files: "/file_system/js/collections/files",
		fileView: "/file_system/js/views/file_view",
		filesView: "/file_system/js/views/files_view",
		fileSystem: "/file_system/js/models/file_system",
		fileSystemView: "/file_system/js/views/file_system_view",

		// 
		blockAppView: "/block_column_maker/js/views/block_app_view"
	},
});


requirejs(["blockAppView"], function(BlockAppView) {
	var blockAppView = new BlockAppView();
});
