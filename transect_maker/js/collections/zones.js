/*=============================
=            Zones            =
=============================*/

define(["baseCollection", "zone"], function(BaseCollection, Zone) {
	var Zones = BaseCollection.extend({
		/* Zones are just a collection of zone models. */
		classname: "Zones",
		model: Zone
	});

	Zones.prototype.comparator = function(zone) {
		return zone.get('topMarker').get('y');
	}


	Zones.prototype.getZoneForY = function(y) {
		/* return the zone to which the point belongs to */
		var containingZone = null;
		this.each(function(zone) {
			if (zone.isYInsideZone(y)) {
				containingZone = zone;
			}
		});
		return containingZone;
	}

	return Zones;
});

/*-----  End of Zones  ------*/
