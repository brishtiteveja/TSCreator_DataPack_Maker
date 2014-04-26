requirejs.config({
	paths: {

		// Base components
		baseView: "../../commons/js/views/base_view",
		baseModel: "../../commons/js/models/base_model",
		baseCollection: "../../commons/js/collections/base_collection",
		transect3dView: "../js/views/transect_3d_view",
	}
});

requirejs(["transect3dView"], function(Transect3dView) {
	new Transect3dView();
});