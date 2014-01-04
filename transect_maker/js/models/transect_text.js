/*====================================
=            TransectText            =
====================================*/

define(["baseModel", "settings"], function(BaseModel, Settings) {
	var TransectText = BaseModel.extend({
		classname: "TransectText",
		constructor: function(attributes, options) {
			var attrs = [{
				edit: false,
				text: attributes.text || _.uniqueId("Text "),
				x: attributes.x ? parseInt(attributes.x) : 0,
				y: attributes.y ? parseInt(attributes.y) : 0,
				age: 0,
				relativeX: null,
				relativeY: null,
				transect: null,
				zone: null,
				settings: new Settings(),
			}];
			BaseModel.apply(this, attrs);
		}
	});

	TransectText.prototype.initialize = function() {
		this.updateTransectAndZone();
	}

	TransectText.prototype.updateTransectAndZone = function() {
		var zone = transectApp.ZonesCollection.getZoneForY(this.get('y'));
		var transect = transectApp.TransectsCollection.getTransectForX(this.get('x'));
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
		return json;
	}

	return TransectText;
});
/*-----  End of TransectText  ------*/
