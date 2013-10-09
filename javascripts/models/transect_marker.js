/*==========================================================
=            TransectMarker that marks the ages            =
==========================================================*/

var TransectMarker = BaseModel.extend({
	classname: "TransectMarker",
	constructor: function(attributes, options) {
		var attrs = [{
			edit: false,
			name: attributes.name || _.uniqueId("Marker "),
			y: attributes.y,
			age: null,
		}];
		this.settings = new Settings({strokeWidth: 2, strokeColor: "#F000000"});
		BaseModel.apply(this, attrs);
	}
});

/*-----  End of TransectMarker  ------*/

/*=======================================
=            TransectMarkers            =
=======================================*/
var TransectMarkers = BaseCollection.extend({
	classname: "TransectMarkers",
	model: TransectMarker
});

TransectMarkers.prototype.comparator = function(marker) {
	return marker.get('y');
};

/*-----  End of TransectMarkers  ------*/

TransectMarkersCollection = new TransectMarkers();