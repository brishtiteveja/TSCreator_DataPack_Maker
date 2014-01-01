requirejs.config({
	paths: {

		// Base components
		baseView: "/commons/js/views/base_view",
		baseModel: "/commons/js/models/base_model",
		baseCollection: "/commons/js/collections/base_collection",

		// App
		app: "/commons/js/models/app",

		// Cursor
		cursorView: "/commons/js/views/cursor_view",
		cursor: "/commons/js/models/cursor",

		// Transect Image
		transectImageView: "/transect_maker/js/views/transect_image_view",
		transectImage: "/transect_maker/js/models/transect_image",

		// Markers
		transectMarkersView: "/transect_maker/js/views/transect_markers_view",
		transectMarkerView: "/transect_maker/js/views/transect_marker_view",
		transectMarker: "/transect_maker/js/models/transect_marker",
		transectMarkers: "/transect_maker/js/collections/transect_markers",
		
		// Wells
		transectWellsView: "/transect_maker/js/views/transect_wells_view",
		transectWellView: "/transect_maker/js/views/transect_well_view",
		transectWell: "/transect_maker/js/models/transect_well",
		transectWells: "/transect_maker/js/collections/transect_wells",
		
		// Zones
		zoneView: "/transect_maker/js/views/zone_view",
		zonesView: "/transect_maker/js/views/zones_view",
		zone: "/transect_maker/js/models/zone",
		zones: "/transect_maker/js/collections/zones",
		
		// Transects
		transectView: "/transect_maker/js/views/transect_view",
		transectsView: "/transect_maker/js/views/transects_view",
		transect: "/transect_maker/js/models/transect",
		transects: "/transect_maker/js/collections/transects",
		
		// Polygons
		polygonView: "/transect_maker/js/views/polygon_view",
		polygonsView: "/transect_maker/js/views/polygons_view",
		polygon: "/transect_maker/js/models/polygon",
		polygons: "/transect_maker/js/collections/polygons",
		
		// Points
		pointView: "/transect_maker/js/views/point_view",
		point: "/transect_maker/js/models/point",
		points: "/transect_maker/js/collections/points",
		
		// Lines
		lineView: "/transect_maker/js/views/line_view",
		line: "/transect_maker/js/models/line",
		lines: "/transect_maker/js/collections/lines",
		
		// Texts
		transectTextView: "/transect_maker/js/views/transect_text_view",
		transectTextsView: "/transect_maker/js/views/transect_texts_view",
		transectText: "/transect_maker/js/models/transect_text",
		transectTexts: "/transect_maker/js/collections/transect_texts",
		
		// Data Exporter
		exporter: "/transect_maker/js/utils/exporter",
		dataExportView: "/transect_maker/js/views/data_export_view",

		// Main View
		transectAppView: "/transect_maker/js/views/transect_app_view",
		
		// Settings
		settings: "/commons/js/models/settings",
	},
});


var transectApp = transectApp || {};
requirejs([
	"transectAppView",
	"transects",
	"transectTexts",
	"polygons",
	"lines",
	"points",
	"zones",
	"transectWells",
	"transectMarkers"], function(
		TransectAppView,
		Transects,
		TransectTexts,
		Polygons,
		Lines,
		Points,
		Zones,
		TransectWells,
		TransectMarkers) {
	transectApp.TransectsCollection = new Transects();
	transectApp.TransectTextsCollection = new TransectTexts();
	transectApp.PolygonsCollection = new Polygons();
	transectApp.LinesCollection = new Lines();
	transectApp.PointsCollection = new Points();
	transectApp.ZonesCollection = new Zones();
	transectApp.TransectWellsCollection = new TransectWells();
	transectApp.TransectMarkersCollection = new TransectMarkers();

	var transectAppView = new TransectAppView();
	// new Loader(transectAppView);
});
