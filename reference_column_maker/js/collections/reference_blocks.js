/*===============================================================
=            ReferenceBlocks is a collection of block models.            =
===============================================================*/

define(["baseCollection", "referenceBlock"], function(BaseCollection, ReferenceBlock) {

	var ReferenceBlocks = BaseCollection.extend({
		classname: "ReferenceBlocks",
		model: ReferenceBlock
	});

	return ReferenceBlocks;
});
/*-----  End of ReferenceBlocks Collection  ------*/

