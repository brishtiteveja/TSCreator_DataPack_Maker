/*=====================================================================
=            LithologyGroupMarkers is a collection of lithologyGroupMarkers.            =
=====================================================================*/

define(["baseCollection", "lithologyGroupMarker"], function(BaseCollection, LithologyGroupMarker) {

	var LithologyGroupMarkers = BaseCollection.extend({
		classname : "LithologyGroupMarkers",
		model     : LithologyGroupMarker
	});

	LithologyGroupMarkers.prototype.comparator = function(lithologyGroupMarker) {
		return lithologyGroupMarker.get('y');
	};

	return LithologyGroupMarkers;
});

/*-----  End of LithologyGroupMarkers is a collection of lithologyGroupMarkers.  ------*/

