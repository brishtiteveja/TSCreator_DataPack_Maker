/*==========================================================
=            TransectMarker that marks the ages            =
==========================================================*/

define(["baseModel"], function(BaseModel) {
	var TransectMarker = BaseModel.extend({
		classname: "TransectMarker",
		constructor: function(attributes, options) {
			var attrs = [{
				edit: false,
				name: attributes.name || _.uniqueId("Time Line "),
				y: attributes.y,
				age: attributes.age !== undefined ? attributes.age : null,
				hover: false,
			}];	
			BaseModel.apply(this, attrs);
		}
	});

	return TransectMarker;
});

/*-----  End of TransectMarker  ------*/
