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

	Transects.prototype.getTransectInNeighborhoodForX = function(x, transect) {
		/* return the transect to which the point belongs to */
		var index = this.indexOf(transect);
		var transect1 = this.at(index - 1);
		var transect2 = this.at(index + 1);
		
		if (transect1 && transect1.isXInsideTransect(x)) {
			return transect1;
		}

		if (transect2 && transect2.isXInsideTransect(x)) {
			return transect2;
		}

		if (transect.isXInsideTransect(x)) {
			return transect;
		}

		return null;
	}

	return Transects;
});

/*-----  End of Transects  ------*/
