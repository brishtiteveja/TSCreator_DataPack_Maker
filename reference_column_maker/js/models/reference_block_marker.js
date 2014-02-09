/*======================================================================
=            ReferenceBlockMarker to represent the block boundaries.            =
======================================================================*/

define(["baseModel", "referenceBlocks"], function(BaseModel, ReferenceBlocks) {

	var ReferenceBlockMarker = BaseModel.extend({
		classname: "ReferenceBlockMarker",
		constructor: function (attributes, app) {
			var attrs = [{
				name        : "TOP",
				edit        : false,
				hover       : false,
				y           : parseInt(attributes.y),
				id          : _.uniqueId("block-marker-"),
				age         : attributes.age ?  parseFloat(attributes.age): null,
				blockColumn : attributes.blockColumn || null,
				style       : "solid",
				app         : app || null,
				blocks      : new ReferenceBlocks(),
				marker      : null,
			}];
			BaseModel.apply(this, attrs);
		}
	});

	ReferenceBlockMarker.prototype.initialize = function() {
	}

	ReferenceBlockMarker.prototype.toJSON = function() {
		var json = _.clone(this.attributes);
		delete json["blocks"];
		delete json["blockColumn"];
		delete json["marker"];
		delete json["app"];
		return json;
	}

	return ReferenceBlockMarker;
});

/*-----  End of ReferenceBlockMarker to represent the block boundaries.  ------*/

