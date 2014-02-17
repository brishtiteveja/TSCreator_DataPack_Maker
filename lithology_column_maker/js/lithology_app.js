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
		loader: "/lithology_column_maker/js/utils/loader",
		
		// Data Exporter
		exporter: "/lithology_column_maker/js/utils/exporter",
		dataExportView: "/lithology_column_maker/js/views/data_export_view",

		// 
		lithology: "/lithology_column_maker/js/models/lithology",
		lithologys: "/lithology_column_maker/js/collections/lithologys",
		lithologyMarker: "/lithology_column_maker/js/models/lithology_marker",
		lithologyMarkers: "/lithology_column_maker/js/collections/lithology_markers",
		lithologyColumn: "/lithology_column_maker/js/models/lithology_column",
		lithologyColumns: "/lithology_column_maker/js/collections/lithology_columns",
		lithologyView: "/lithology_column_maker/js/views/lithology_view",
		lithologyMarkerView: "/lithology_column_maker/js/views/lithology_marker_view",
		lithologyColumnView: "/lithology_column_maker/js/views/lithology_column_view",
		lithologyColumnsView: "/lithology_column_maker/js/views/lithology_columns_view",

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
		lithologyAppView: "/lithology_column_maker/js/views/lithology_app_view"
	},
});


requirejs(["lithologyAppView"], function(LithologyAppView) {
	var lithologyAppView = new LithologyAppView();
});
