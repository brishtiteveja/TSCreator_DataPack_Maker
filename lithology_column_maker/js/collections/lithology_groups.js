/*===================================================================================
=            LithologyGroups is a collection of lithologyGroup models.                   =
===================================================================================*/

define(["baseCollection", "lithologyGroup"], function(BaseCollection, LithologyGroup) {

	var LithologyGroups = BaseCollection.extend({
		classname: "LithologyGroups",
		model: LithologyGroup
	});

	return LithologyGroups;
});
/*-----  End of LithologyGroups Collection  ------*/

