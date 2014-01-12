/*=====================================================================
=            BlockMarkers is a collection of blockMarkers.            =
=====================================================================*/

define(["baseCollection", "blockMarker"], function(BaseCollection, BlockMarker) {

	var BlockMarkers = BaseCollection.extend({
		classname : "BlockMarkers",
		model     : BlockMarker
	});

	BlockMarkers.prototype.comparator = function(blockMarker) {
		return blockMarker.get('y');
	};

	return BlockMarkers;
});

/*-----  End of BlockMarkers is a collection of blockMarkers.  ------*/

