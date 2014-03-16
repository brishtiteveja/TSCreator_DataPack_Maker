/*====================================================================================
=            LithologyGroupMarker to represent the lithology boundaries.             =
=====================================================================================*/

define(["baseModel", "lithologyGroups"], function(BaseModel, LithologyGroups) {

	var LithologyGroupMarker = BaseModel.extend({
		classname: "LithologyGroupMarker",
		constructor: function (attributes, app) {
			var attrs = [{
				name            : "TOP",
				edit            : false,
				hover           : false,
				y               : parseInt(attributes.y),
				id              : _.uniqueId("lithology-marker-"),
				age             : null,
				relativeY       : null,
				lithologyColumn : attributes.lithologyColumn || null,
				style           : "solid",
				app             : app || null,
				zone            : null,
				lithologyGroups : new LithologyGroups(),
			}];
			BaseModel.apply(this, attrs);
		}
	});

	LithologyGroupMarker.prototype.initialize = function() {
		this.updateZone();
	}

	LithologyGroupMarker.prototype.toJSON = function() {
		var json = _.clone(this.attributes);
		delete json["lithologyGroups"];
		delete json["lithologyColumn"];
		delete json["app"];
		return json;
	}

	LithologyGroupMarker.prototype.updateZone = function() {
		var zone = this.get('zone') === null ? this.get('app').ZonesCollection.getZoneForY(this.get('y')) :
										this.get('app').ZonesCollection.getZoneInNeighborhoodForY(this.get('y'), this.get('zone'));

		if (zone !== null) {
			this.set({
				zone: zone
			});	
			this.updateRelativeCoordinates();
		}
	}

	LithologyGroupMarker.prototype.updateRelativeCoordinates = function() {
		this.set({
			relativeY: this.get('zone').getRelativeY(this.get('y')),
			age: this.get('zone').getAbsoluteAge(this.get('y'))
		});
	}
	
	return LithologyGroupMarker;
});

/*-----  End of LithologyGroupMarker to represent the lithology boundaries.  ------*/

