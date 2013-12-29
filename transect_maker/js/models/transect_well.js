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
				id: _.uniqueId("well-"),
				x: attributes.x,
				lat: null,
				lon: null,
				settings: new Settings(),
				width: 100,
			}];
			BaseModel.apply(this, attrs);
		}
	});

	return TransectWell;
});

/*-----  End of TransectWell model  ------*/
