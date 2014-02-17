/*=====================================================================
=            LithologyMarkers is a collection of lithologyMarkers.            =
=====================================================================*/

define(["baseCollection", "lithologyMarker"], function(BaseCollection, LithologyMarker) {

	var LithologyMarkers = BaseCollection.extend({
		classname : "LithologyMarkers",
		model     : LithologyMarker
	});

	LithologyMarkers.prototype.comparator = function(lithologyMarker) {
		return lithologyMarker.get('y');
	};

	return LithologyMarkers;
});

/*-----  End of LithologyMarkers is a collection of lithologyMarkers.  ------*/

