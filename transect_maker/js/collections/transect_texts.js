/*================================================
=            TransectTexts Collection            =
================================================*/

define(["baseCollection", "transectText"], function(BaseCollection, TransectText) {
	var TransectTexts = BaseCollection.extend({
		classname: "TransectTexts",
		model: TransectText
	});

	TransectTexts.prototype.updateTransectTexts = function() {
		this.each(function(transect) {
			transect.updateTransectAndZone();
		});
		return true;
	}	

	return TransectTexts;
})
/*-----  End of TransectTexts Collection  ------*/

