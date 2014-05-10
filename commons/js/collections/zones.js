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

	Zones.prototype.getZoneInNeighborhoodForY = function(y, zone) {
		this.sort();
		if (!zone) {
			return null;
		}
		/* return the zone to which the point belongs to */
		var index = this.indexOf(zone);
		var zone1 = this.at(index - 1);
		var zone2 = this.at(index + 1);
		if (zone.isYInsideZone(y)) {
			return zone;
		}
		if (zone1 && zone1.isYInsideZone(y)) {
			return zone1;
		}
		if (zone2 && zone2.isYInsideZone(y)) {
			return zone2;
		}
		return null;
	}


	return Zones;
});

/*-----  End of Zones  ------*/