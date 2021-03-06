/*==========================================
=            TransectWell model            =
==========================================*/

define(["baseModel", "settings"], function(BaseModel, Settings) {
	var TransectWell = BaseModel.extend({
		classname: "TransectWell",
		constructor: function(attributes, options) {
			var attrs = [{
				edit: false,
				name: attributes.name || _.uniqueId("Well "),
				id: attributes.id || _.uniqueId("well-"),
				x: attributes.x,
				lat: attributes.lat || null,
				lon: attributes.lon || null,
				settings: new Settings(),
				width: 100,
				hover: false,
				description: attributes.description || null,
			}];
			BaseModel.apply(this, attrs);
		}
	});

	TransectWell.prototype.dragEnd = function() {
		this.trigger('dragEnd');
	}

	return TransectWell;
});

/*-----  End of TransectWell model  ------*/