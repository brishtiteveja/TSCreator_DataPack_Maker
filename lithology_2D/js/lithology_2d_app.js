requirejs.config({
	paths: {
		// Libraries
		polyK: "../../commons/js/lib/polyK",
		raphael: "../../commons/js/lib/raphael",

		// Base components
		baseView: "../../commons/js/views/base_view",
		baseModel: "../../commons/js/models/base_model",
		baseCollection: "../../commons/js/collections/base_collection",

		// Top Level View
		lithology2dView: "../js/views/lithology_2d_view",

		// Points
		pointView: "./views/point_view",
		point: "./models/point",
		points: "./collections/points",

		// Polygon
		polygonView: "./views/polygon_view",
		polygonsView: "./views/polygons_view",
		polygon: "./models/polygon",
		polygons: "./collections/polygons",


		// Map View
		mapView: "../js/views/map_view"
	}
});

requirejs(["lithology2dView"], function(Lithology2dView) {
	new Lithology2dView();
});