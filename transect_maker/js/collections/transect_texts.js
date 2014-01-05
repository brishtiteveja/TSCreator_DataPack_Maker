/*================================================
=            TransectTexts Collection            =
================================================*/

define(["baseCollection", "transectText"], function(BaseCollection, TransectText) {
	var TransectTexts = BaseCollection.extend({
		classname: "TransectTexts",
		model: TransectText
	});

	TransectTexts.prototype.updateTransectTexts = function() {
		this.each(function(text) {
			text.updateTransectAndZone();
		});
		return true;
	}

	TransectTexts.prototype.comparator = function(text) {
		return text.get('y');
	}

	return TransectTexts;
})
/*-----  End of TransectTexts Collection  ------*/

