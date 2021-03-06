requirejs.config({
    baseUrl: "../../",
    paths: {

        // Libraries
        polyK: "commons/js/lib/polyK",
        raphael: "commons/js/lib/raphael",
        jszip: "commons/js/lib/jszip.min",
        filesaver: "commons/js/lib/FileSaver",

        // Base components
        baseView: "commons/js/views/base_view",
        baseModel: "commons/js/models/base_model",
        baseCollection: "commons/js/collections/base_collection",

        // App
        app: "commons/js/models/app",

        // Cursor
        cursorView: "commons/js/views/cursor_view",
        cursor: "commons/js/models/cursor",

        // Image
        imageView: "commons/js/views/image_view",
        imageOb: "commons/js/models/image",

        // Markers
        markersView: "commons/js/views/markers_view",
        markerView: "commons/js/views/marker_view",
        marker: "commons/js/models/marker",
        markers: "commons/js/collections/markers",

        // Wells
        transectWellsView: "transect_maker/js/views/transect_wells_view",
        transectWellView: "transect_maker/js/views/transect_well_view",
        transectWell: "transect_maker/js/models/transect_well",
        transectWells: "transect_maker/js/collections/transect_wells",

        // Zones
        zoneView: "commons/js/views/zone_view",
        zonesView: "commons/js/views/zones_view",
        zone: "commons/js/models/zone",
        zones: "commons/js/collections/zones",

        // Transects
        transectView: "transect_maker/js/views/transect_view",
        transectsView: "transect_maker/js/views/transects_view",
        transect: "transect_maker/js/models/transect",
        transects: "transect_maker/js/collections/transects",

        // Polygons
        polygonView: "transect_maker/js/views/polygon_view",
        polygonsView: "transect_maker/js/views/polygons_view",
        polygon: "transect_maker/js/models/polygon",
        polygons: "transect_maker/js/collections/polygons",

        // Points
        pointView: "transect_maker/js/views/point_view",
        point: "transect_maker/js/models/point",
        points: "transect_maker/js/collections/points",

        // Lines
        lineView: "transect_maker/js/views/line_view",
        line: "transect_maker/js/models/line",
        lines: "transect_maker/js/collections/lines",

        // Texts
        transectTextView: "transect_maker/js/views/transect_text_view",
        transectTextsView: "transect_maker/js/views/transect_texts_view",
        transectText: "transect_maker/js/models/transect_text",
        transectTexts: "transect_maker/js/collections/transect_texts",

        // Data Exporter
        exporter: "transect_maker/js/utils/exporter",
        dataExportView: "transect_maker/js/views/data_export_view",

        // Data Loader
        loader: "transect_maker/js/utils/loader",
        dataImportView: "transect_maker/js/views/data_import_view",

        // Main View
        transectAppView: "transect_maker/js/views/transect_app_view",

        // Settings
        settings: "commons/js/models/settings",

        // File System
        file: "file_system/js/models/file",
        files: "file_system/js/collections/files",
        fileView: "file_system/js/views/file_view",
        filesView: "file_system/js/views/files_view",
        fileSystem: "file_system/js/models/file_system",
        fileSystemView: "file_system/js/views/file_system_view",

        // Reference Column Data Loader
        referenceColumnLoader: "reference_column_maker/js/utils/loader",

        // Reference column
        referenceColumn: "reference_column_maker/js/models/reference_column",
        referenceBlock: "reference_column_maker/js/models/reference_block",
        referenceBlocks: "reference_column_maker/js/collections/reference_blocks",
        referenceBlockMarker: "reference_column_maker/js/models/reference_block_marker",
        referenceBlockMarkers: "reference_column_maker/js/collections/reference_block_markers",
        referenceBlockColumn: "reference_column_maker/js/models/reference_block_column",
        referenceBlockColumns: "reference_column_maker/js/collections/reference_block_columns",
        referenceBlockView: "reference_column_maker/js/views/reference_block_view",
        referenceBlockMarkerView: "reference_column_maker/js/views/reference_block_marker_view",
        referenceBlockColumnView: "reference_column_maker/js/views/reference_block_column_view",
        referenceBlockColumnsView: "reference_column_maker/js/views/reference_block_columns_view",
        referenceColumnSideView: "reference_column_maker/js/views/reference_column_side_view",
    },
});


var transectApp = transectApp || {};
requirejs(["transectAppView"], function (TransectAppView) {
    var transectAppView = new TransectAppView();
});
