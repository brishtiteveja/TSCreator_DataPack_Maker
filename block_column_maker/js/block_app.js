requirejs.config({
    paths: {
        // Libraries
        polyK: "../../commons/js/lib/polyK",
        raphael: "../../commons/js/lib/raphael",
        jszip: "../../commons/js/lib/jszip.min",
        filesaver: "../../commons/js/lib/FileSaver",

        // Base components
        baseView: "../../commons/js/views/base_view",
        baseModel: "../../commons/js/models/base_model",
        baseCollection: "../../commons/js/collections/base_collection",

        // App
        app: "../../commons/js/models/app",


        // Settings
        settings: "../../commons/js/models/settings",

        // Cursor
        cursorView: "../../commons/js/views/cursor_view",
        cursor: "../../commons/js/models/cursor",

        // Markers
        markersView: "../../commons/js/views/markers_view",
        markerView: "../../commons/js/views/marker_view",
        marker: "../../commons/js/models/marker",
        markers: "../../commons/js/collections/markers",

        // Zones
        zoneView: "../../commons/js/views/zone_view",
        zonesView: "../../commons/js/views/zones_view",
        zone: "../../commons/js/models/zone",
        zones: "../../commons/js/collections/zones",

        // Image
        imageView: "../../commons/js/views/image_view",
        imageOb: "../../commons/js/models/image",

        // Data Loader
        loader: "../../block_column_maker/js/utils/loader",

        // Data Exporter
        exporter: "../../block_column_maker/js/utils/exporter",
        dataExportView: "../../block_column_maker/js/views/data_export_view",

        //
        block: "../../block_column_maker/js/models/block",
        blocks: "../../block_column_maker/js/collections/blocks",
        blockMarker: "../../block_column_maker/js/models/block_marker",
        blockMarkers: "../../block_column_maker/js/collections/block_markers",
        blockColumn: "../../block_column_maker/js/models/block_column",
        blockColumns: "../../block_column_maker/js/collections/block_columns",
        blockView: "../../block_column_maker/js/views/block_view",
        blockMarkerView: "../../block_column_maker/js/views/block_marker_view",
        blockColumnView: "../../block_column_maker/js/views/block_column_view",
        blockColumnsView: "../../block_column_maker/js/views/block_columns_view",

        // File System
        file: "../../file_system/js/models/file",
        files: "../../file_system/js/collections/files",
        fileView: "../../file_system/js/views/file_view",
        filesView: "../../file_system/js/views/files_view",
        fileSystem: "../../file_system/js/models/file_system",
        fileSystemView: "../../file_system/js/views/file_system_view",

        // Block App View
        blockAppView: "../../block_column_maker/js/views/block_app_view",

        // Reference Column Data Loader
        referenceColumnLoader: "../../reference_column_maker/js/utils/loader",

        // Reference column
        referenceColumn: "../../reference_column_maker/js/models/reference_column",
        referenceBlock: "../../reference_column_maker/js/models/reference_block",
        referenceBlocks: "../../reference_column_maker/js/collections/reference_blocks",
        referenceBlockMarker: "../../reference_column_maker/js/models/reference_block_marker",
        referenceBlockMarkers: "../../reference_column_maker/js/collections/reference_block_markers",
        referenceBlockColumn: "../../reference_column_maker/js/models/reference_block_column",
        referenceBlockColumns: "../../reference_column_maker/js/collections/reference_block_columns",
        referenceBlockView: "../../reference_column_maker/js/views/reference_block_view",
        referenceBlockMarkerView: "../../reference_column_maker/js/views/reference_block_marker_view",
        referenceBlockColumnView: "../../reference_column_maker/js/views/reference_block_column_view",
        referenceBlockColumnsView: "../../reference_column_maker/js/views/reference_block_columns_view",
        referenceColumnSideView: "../../reference_column_maker/js/views/reference_column_side_view",
    },
});


requirejs(["blockAppView"], function (BlockAppView) {
    var blockAppView = new BlockAppView();
});
