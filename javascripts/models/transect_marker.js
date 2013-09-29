/*==========================================================
=            TransectMarker that marks the ages            =
==========================================================*/

var TransectMarker = BaseModel.extend({
	classname: "TransectMarker",
	constructor: function(attributes, options) {
		var attrs = [{
			edit: false,
			name: _.uniqueId("Marker "),
			y: attributes.y
		}];
		this.settings = new Settings({strokeWidth: 5, strokeColor: "#F000000"})
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
	return marker.get('age');
};

/*-----  End of TransectMarkers  ------*/
