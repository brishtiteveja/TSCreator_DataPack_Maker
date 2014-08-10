requirejs.config({
    paths: {

        raphael: "/commons/js/lib/raphael",

        // Base components
        baseView: "/commons/js/views/base_view",
        baseModel: "/commons/js/models/base_model",
        baseCollection: "/commons/js/collections/base_collection",

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

        // Settings
        settings: "/commons/js/models/settings",

        // Cursor
        cursorView: "/commons/js/views/cursor_view",
        cursor: "/commons/js/models/cursor",

        // Image
        imageView: "/commons/js/views/image_view",
        imageOb: "/commons/js/models/image",


        // Libraries
        polyK: "/commons/js/lib/polyK",

        // File System
        file: "/file_system/js/models/file",
        files: "/file_system/js/collections/files",
        fileView: "/file_system/js/views/file_view",
        filesView: "/file_system/js/views/files_view",
        fileSystem: "/file_system/js/models/file_system",
        fileSystemView: "/file_system/js/views/file_system_view",

        // Reference Column Data Loader
        referenceColumnLoader: "/reference_column_maker/js/utils/loader",

        // Reference column
        referenceColumn: "/reference_column_maker/js/models/reference_column",
        referenceBlock: "/reference_column_maker/js/models/reference_block",
        referenceBlocks: "/reference_column_maker/js/collections/reference_blocks",
        referenceBlockMarker: "/reference_column_maker/js/models/reference_block_marker",
        referenceBlockMarkers: "/reference_column_maker/js/collections/reference_block_markers",
        referenceBlockColumn: "/reference_column_maker/js/models/reference_block_column",
        referenceBlockColumns: "/reference_column_maker/js/collections/reference_block_columns",
        referenceBlockView: "/reference_column_maker/js/views/reference_block_view",
        referenceBlockMarkerView: "/reference_column_maker/js/views/reference_block_marker_view",
        referenceBlockColumnView: "/reference_column_maker/js/views/reference_block_column_view",
        referenceBlockColumnsView: "/reference_column_maker/js/views/reference_block_columns_view",
        referenceColumnSideView: "/reference_column_maker/js/views/reference_column_side_view",

        //EvTree
        evTreeAppView: "/evtree_maker/js/views/evtree_app_view",
        evTreeView: "/evtree_maker/js/views/evtree_view",
        nodeView: "/evtree_maker/js/views/node_view",
        branchView: "/evtree_maker/js/views/branch_view",
        childNodeView: "/evtree_maker/js/views/child_node_view",
        //
        node: "/evtree_maker/js/models/node",
        nodes: "/evtree_maker/js/collections/nodes",
        evTree: "/evtree_maker/js/models/evtree",
    },
});


var evTreeApp = evTreeApp || {};
requirejs(["evTreeAppView"], function (EvTreeAppView) {
    var evTreeAppView = new EvTreeAppView();
});