/*==========================================
=            TransectWell model            =
==========================================*/

var TransectWell = BaseModel.extend({
	classname: "TransectWell",
	constructor: function(attributes, options) {
		var attrs = [{
			edit: false,
			name: attributes.name || _.uniqueId("Well "),
			x: attributes.x
		}];
		this.settings = new Settings();
		BaseModel.apply(this, attrs);
	}
});

/*-----  End of TransectWell model  ------*/

/*============================================
=            TransectWells models            =
============================================*/

var TransectWells = BaseCollection.extend({
	classname: "TransectWells",
	model: TransectWell
});

TransectWells.prototype.comparator = function(well) {
	return well.get('x')
};

/*-----  End of TransectWells  ------*/

var transectApp = transectApp || {};
transectApp.TransectWellsCollection = new TransectWells();