/*============================================
=            TransectWells models            =
============================================*/

define(["baseCollection", "transectWell"], function(BaseCollection, TransectWell) {
	
	var TransectWells = BaseCollection.extend({
		classname: "TransectWells",
		model: TransectWell
	});

	TransectWells.prototype.comparator = function(well) {
		return well.get('x');
	};


	return TransectWells;
});

/*-----  End of TransectWells  ------*/
