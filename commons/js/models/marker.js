/*==========================================================
=            Marker that marks the ages                    =
==========================================================*/

define(["baseModel"], function(BaseModel) {
	var Marker = BaseModel.extend({
		classname: "Marker",
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

	Marker.prototype.dragEnd = function() {
		this.trigger('dragEnd');
	}

	return Marker;
});

/*-----  End of Marker  ------*/