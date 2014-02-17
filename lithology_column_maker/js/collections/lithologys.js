/*===============================================================
=            Lithologys is a collection of lithology models.            =
===============================================================*/

define(["baseCollection", "lithology"], function(BaseCollection, Lithology) {

	var Lithologys = BaseCollection.extend({
		classname: "Lithologys",
		model: Lithology
	});

	return Lithologys;
});
/*-----  End of Lithologys Collection  ------*/

