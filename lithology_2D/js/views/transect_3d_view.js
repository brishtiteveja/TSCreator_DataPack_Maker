define(["baseView"], function(BaseView) {

	var Transect3dView = BaseView.extend({
		el: ".container",
	});

	Transect3dView.prototype.initialize = function() {
		this.viewer = new Cesium.Viewer('canvas', {
			sceneMode: Cesium.SceneMode.COLUMBUS_VIEW,
			timeline: false,
			animation: false,
			automaticallyTrackDataSourceClocks: false,
		});

		this.scene = this.viewer.scene;
		this.canvas = this.canvas;
		this.primitives = this.scene.primitives;
		this.ellipsoid = this.viewer.centralBody.ellipsoid

		function boxPositions() {
			return [
				new Cesium.Cartesian2(-50000, -50000),
				new Cesium.Cartesian2(50000, -50000),
				new Cesium.Cartesian2(50000, 50000),
				new Cesium.Cartesian2(-50000, 50000)
			];
		}


		// Striped Wall
		this.primitives.add(new Cesium.Primitive({
			geometryInstances: new Cesium.GeometryInstance({
				geometry: new Cesium.WallGeometry({
					materialSupport: Cesium.MaterialAppearance.MaterialSupport.BASIC.vertexFormat,
					positions: this.ellipsoid.cartographicArrayToCartesianArray([
						Cesium.Cartographic.fromDegrees(-100.5, 50.0, 300000.0),
						Cesium.Cartographic.fromDegrees(-75.5, 50.0, 300000.0)
					])
				})
			}),
			appearance: new Cesium.MaterialAppearance({
				material: new Cesium.Material({
					fabric: {
						type: 'DiffuseMap',
						uniforms: {
							image: "../../../pattern_manager/patterns/lava.svg"
						}
					}
				}),
				faceForward: true
			}),
		}));
		// this.scene.scene2D.projection = new Cesium.WebMercatorProjection(Cesium.Ellipsoid.WGS84);

		// this.scene.scene2D.projection = new Cesium.GeographicProjection(Cesium.Ellipsoid.WGS84);
	}

	return Transect3dView;
});