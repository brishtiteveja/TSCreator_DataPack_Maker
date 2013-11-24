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
			description: attributes.description || null
		}];
		this.topMarker = topMarker;
		this.baseMarker = baseMarker;
		BaseModel.apply(this, attrs);
	}
});

Zone.prototype.isYInsideZone = function(y) {
	/* Check if the zone contains the point. i.e. the point should lie
	between the topMarker and baseMarker */
	if (this.topMarker.get('y') <= y && y <= this.baseMarker.get('y')) {
		return true;
	}
	return false;
}

Zone.prototype.getRelativeY = function(y) {
	if (this.topMarker.get('y') <= y && y <= this.baseMarker.get('y')) {
		var num = ((y - this.topMarker.get('y'))/(this.baseMarker.get('y') - this.topMarker.get('y')))
		return Math.round(num * 100) / 100;
	}
	return null;
}

Zone.prototype.getAbsoluteAge = function(y) {
	if (this.topMarker.get('y') <= y && y <= this.baseMarker.get('y') 
		&& this.topMarker.get('age') != null && this.baseMarker.get('age') != null) {
		var num = ((y - this.topMarker.get('y'))/(this.baseMarker.get('y') - this.topMarker.get('y')))
		age = num * (this.baseMarker.get('age') - this.topMarker.get('age')) + this.topMarker.get('age');
		return Math.round(age * 100) / 100;
	}
	return null;
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
/*-----  End of Zones  ------*/

var transectApp = transectApp || {}
transectApp.ZonesCollection = new Zones();