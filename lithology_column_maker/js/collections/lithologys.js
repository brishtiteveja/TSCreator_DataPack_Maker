/*===============================================================
=            Lithologys is a collection of lithology models.            =
===============================================================*/

define(["baseCollection", "lithology"], function(BaseCollection, Lithology) {

	var Lithologys = BaseCollection.extend({
		classname: "Lithologys",
		model: Lithology
	});

	Lithologys.prototype.comparator = function(lithology) {
		return lithology.get('top').get('y');
	};


	return Lithologys;
});
/*-----  End of Lithologys Collection  ------*/

