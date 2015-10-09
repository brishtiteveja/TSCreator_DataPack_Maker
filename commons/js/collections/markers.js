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

    Markers.prototype.hasUndefinedAges = function() {
        return this.any(function (marker) {
	    if (marker.get('age') == 0)
		return 0;
            return (!marker.get('age'))
        });
    };
	return Markers;
});

/*-----  End of Markers  ------*/
