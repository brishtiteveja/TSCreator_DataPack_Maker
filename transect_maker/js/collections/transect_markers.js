/*=======================================
=            TransectMarkers            =
=======================================*/

define(["baseCollection", "transectMarker"], function(BaseCollection, TransectMarker) {
	var TransectMarkers = BaseCollection.extend({
		classname: "TransectMarkers",
		model: TransectMarker
	});

	TransectMarkers.prototype.comparator = function(marker) {
		return marker.get('y');
	};

	return TransectMarkers;
});

/*-----  End of TransectMarkers  ------*/