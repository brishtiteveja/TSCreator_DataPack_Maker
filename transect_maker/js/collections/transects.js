var transectApp = transectApp || {};

/*=================================
=            Transects            =
=================================*/

define(["baseCollection", "transect"], function(BaseCollection, Transect) {
	var Transects = BaseCollection.extend({
		classname: "Transects",
		model: Transect
	});

	Transects.prototype.getTransectForX = function(x) {
		/* return the transect to which the point belongs to */
		var containingTransect = null;
		this.each(function(transect) {
			if (transect.isXInsideTransect(x)) {
				containingTransect = transect;
			}
		});
		return containingTransect;
	}

	return Transects;
});

/*-----  End of Transects  ------*/
