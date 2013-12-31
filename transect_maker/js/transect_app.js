requirejs.config({
	paths: {
		// views
		baseView: "/commons/js/views/base_view",
		cursorView: "/commons/js/views/cursor_view",
		transectImageView: "/transect_maker/js/views/transect_image_view",
		transectMarkersView: "/transect_maker/js/views/transect_markers_view",
		transectMarkerView: "/transect_maker/js/views/transect_marker_view",
		transectWellsView: "/transect_maker/js/views/transect_wells_view",
		transectWellView: "/transect_maker/js/views/transect_well_view",
		zoneView: "/transect_maker/js/views/zone_view",
		zonesView: "/transect_maker/js/views/zones_view",
		transectView: "/transect_maker/js/views/transect_view",
		transectsView: "/transect_maker/js/views/transects_view",
		pointView: "/transect_maker/js/views/point_view",
		lineView: "/transect_maker/js/views/line_view",
		polygonView: "/transect_maker/js/views/polygon_view",
		polygonsView: "/transect_maker/js/views/polygons_view",
		transectTextView: "/transect_maker/js/views/transect_text_view",
		transectTextsView: "/transect_maker/js/views/transect_texts_view",
		dataExportView: "/transect_maker/js/views/data_export_view",
		transectAppView: "/transect_maker/js/views/transect_app_view",
		// models
		baseModel: "/commons/js/models/base_model",
		cursor: "/commons/js/models/cursor",
		settings: "/commons/js/models/settings",
		transectImage: "/transect_maker/js/models/transect_image",
		transectMarker: "/transect_maker/js/models/transect_marker",
		transectWell: "/transect_maker/js/models/transect_well",
		zone: "/transect_maker/js/models/zone",
		transect: "/transect_maker/js/models/transect",
		point: "/transect_maker/js/models/point",
		line: "/transect_maker/js/models/line",
		polygon: "/transect_maker/js/models/polygon",
		transectText: "/transect_maker/js/models/transect_text",
		// collections
		baseCollection: "/commons/js/collections/base_collection",
		transectMarkers: "/transect_maker/js/collections/transect_markers",
		transectWells: "/transect_maker/js/collections/transect_wells",
		zones: "/transect_maker/js/collections/zones",
		transects: "/transect_maker/js/collections/transects",
		points: "/transect_maker/js/collections/points",
		lines: "/transect_maker/js/collections/lines",
		polygons: "/transect_maker/js/collections/polygons",
		transectTexts: "/transect_maker/js/collections/transect_texts",
		// utilities
		exporter: "/transect_maker/js/utils/exporter",
	},
	name: "transect-maker.0",
	out: "transect-maker-built.0"
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
