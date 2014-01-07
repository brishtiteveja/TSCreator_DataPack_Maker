/*====================================
=            TransectText            =
====================================*/

define(["baseModel", "settings"], function(BaseModel, Settings) {
	var TransectText = BaseModel.extend({
		classname: "TransectText",
		constructor: function(attributes, app) {
			
			var settings = new Settings();
			var attrs = [{
				edit: false,
				text: attributes.text || _.uniqueId("Text "),
				x: attributes.x ? parseInt(attributes.x) : 0,
				y: attributes.y ? parseInt(attributes.y) : 0,
				age: 0,
				transect: null,
				zone: null,
				settings: settings,
				// bounding box for the text.
				bBox: null,
				app: app
			}];
			BaseModel.apply(this, attrs);
		}
	});

	TransectText.prototype.initialize = function() {
		this.updateTransectAndZone();
	}

	TransectText.prototype.updateTransectAndZone = function() {
		var zone = this.get('app').ZonesCollection.getZoneForY(this.get('y'));
		var transect = this.get('app').TransectsCollection.getTransectForX(this.get('x'));
		if (zone !== null && transect !== null) {
			this.set({
				transect: transect,
				zone: zone
			});	
			this.updateRelativeCoordinates();
		}
	}

	TransectText.prototype.updateRelativeCoordinates = function(arguments) {
		this.set({
			relativeX: this.get('transect').getRelativeX(this.get('x')),
			relativeY: this.get('zone').getRelativeY(this.get('y')),
			age: this.get('zone').getAbsoluteAge(this.get('y'))
		});
	}

	TransectText.prototype.toJSON = function() {
		var json = _.clone(this.attributes);
		delete json["transect"];
		delete json["zone"];
		delete json["app"];
		return json;
	}

	return TransectText;
});
/*-----  End of TransectText  ------*/
