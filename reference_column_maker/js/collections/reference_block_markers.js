/*=====================================================================
=            ReferenceBlockMarkers is a collection of ReferencereferenceBlockMarkers.            =
=====================================================================*/

define(["baseCollection", "referenceBlockMarker"], function(BaseCollection, BlockMarker) {

	var ReferenceBlockMarkers = BaseCollection.extend({
		classname : "ReferenceBlockMarkers",
		model     : BlockMarker
	});

	ReferenceBlockMarkers.prototype.comparator = function(referenceBlockMarker) {
		return referenceBlockMarker.get('y');
	};

	return ReferenceBlockMarkers;
});

/*-----  End of ReferenceBlockMarkers is a collection of ReferencereferenceBlockMarkers.  ------*/

