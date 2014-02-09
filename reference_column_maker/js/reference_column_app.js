requirejs.config({
	paths: {

		// Base components
		baseView                  : "/commons/js/views/base_view",
		baseModel                 : "/commons/js/models/base_model",
		baseCollection            : "/commons/js/collections/base_collection",

		// App
		app                       : "/commons/js/models/app",

		// Settings
		settings                  : "/commons/js/models/settings",

		// Cursor
		cursorView                : "/commons/js/views/cursor_view",
		cursor                    : "/commons/js/models/cursor",

		// Data Loader
		loader                    : "/reference_column_maker/js/utils/loader",
		
		// Data Exporter
		exporter                  : "/reference_column_maker/js/utils/exporter",
		dataExportView            : "/reference_column_maker/js/views/reference_data_export_view",

		// 
		referenceBlock            : "/reference_column_maker/js/models/reference_block",
		referenceBlocks           : "/reference_column_maker/js/collections/reference_blocks",
		referenceBlockMarker      : "/reference_column_maker/js/models/reference_block_marker",
		referenceBlockMarkers     : "/reference_column_maker/js/collections/reference_block_markers",
		referenceBlockColumn      : "/reference_column_maker/js/models/reference_block_column",
		referenceBlockColumns     : "/reference_column_maker/js/collections/reference_block_columns",
		referenceBlockView        : "/reference_column_maker/js/views/reference_block_view",
		referenceBlockMarkerView  : "/reference_column_maker/js/views/reference_block_marker_view",
		referenceBlockColumnView  : "/reference_column_maker/js/views/reference_block_column_view",
		referenceBlockColumnsView : "/reference_column_maker/js/views/reference_block_columns_view",

		// Libraries
		polyK                     : "/commons/js/lib/polyK",

		// File System
		file                      : "/file_system/js/models/file",
		files                     : "/file_system/js/collections/files",
		fileView                  : "/file_system/js/views/file_view",
		filesView                 : "/file_system/js/views/files_view",
		fileSystem                : "/file_system/js/models/file_system",
		fileSystemView            : "/file_system/js/views/file_system_view",

		// 
		referenceBlockAppView     : "/reference_column_maker/js/views/reference_block_app_view"
	},
});


requirejs(["referenceBlockAppView"], function(ReferenceBlockAppView) {
	var referenceBlockAppView = new ReferenceBlockAppView();
});
