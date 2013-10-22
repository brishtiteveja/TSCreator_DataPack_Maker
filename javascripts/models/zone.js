/*============================
=            Zone            =
============================*/

var Zone = BaseModel.extend({
	/* Zone is the region between the two blocks. Idea here is that
	the reference column will be converted into zones and the points
	will be drawn relative to the zone they are in */
	
	classname: "Zone",
	constructor: function(attributes, topMarker, baseMarker) {
		/* A zone will have a topMarker and a baseMarker */
		
		var attrs = [{
			edit: false,
			name: attributes.name || _.uniqueId("Zone "),
		}];
		this.topMarker = topMarker;
		this.baseMarker = baseMarker;
		BaseModel.apply(this, attrs);
	}
});

Zone.prototype.isPointInsideZone = function(point) {
	/* Check if the zone contains the point. i.e. the point should lie
	between the topMarker and baseMarker */
	if (this.topMarker.get('y') < point.get('y') && point.get('y') < this.baseMarker.get('y')) {
		return true;
	}
	return false;
}

/*-----  End of Zone  ------*/

/*=============================
=            Zones            =
=============================*/

var Zones = BaseCollection.extend({
	/* Zones are just a collection of zone models. */
	classname: "Zones",
	model: Zone
});


Zones.prototype.getZoneForPoint = function(point) {
	/* return the zone to which the point belongs to */
	var containingZone = null;
	this.each(function(zone) {
		if (zone.isPointInsideZone(point)) {
			containingZone = zone;	
		}
	});
	return containingZone;
}
/*-----  End of Zones  ------*/

ZonesCollection = new Zones();