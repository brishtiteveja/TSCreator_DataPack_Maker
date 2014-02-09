/*================================================
=            Block Columns collection            =
================================================*/

define(["baseCollection", "referenceBlockColumn"], function(BaseCollection, ReferenceBlockColumn) {

	var ReferenceBlockColumns = BaseCollection.extend({
		classname: "ReferenceBlockColumns",
		model: ReferenceBlockColumn,
	});

	return ReferenceBlockColumns;
});

/*-----  End of Block Columns collection  ------*/

