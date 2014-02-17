/*================================================
=            Lithology Columns collection            =
================================================*/

define(["baseCollection", "lithologyColumn"], function(BaseCollection, LithologyColumn) {

	var LithologyColumns = BaseCollection.extend({
		classname: "LithologyColumns",
		model: LithologyColumn,
	});

	return LithologyColumns;
});

/*-----  End of Lithology Columns collection  ------*/

