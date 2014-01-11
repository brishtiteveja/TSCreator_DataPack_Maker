/*=======================================
=            Markers            		=
=======================================*/

define(["baseCollection", "marker"], function(BaseCollection, Marker) {
	var Markers = BaseCollection.extend({
		classname: "Markers",
		model: Marker
	});

	Markers.prototype.comparator = function(marker) {
		return marker.get('y');
	};
	return Markers;
});

/*-----  End of Markers  ------*/