/*================================
=            Transect            =
================================*/

var Transect = BaseModel.extend({
	classname: "Transect",
	constructor: function(attributes, wellLeft, wellRight) {
		var attrs = [{
			edit: false,
			name: attributes.name || _.uniqueId("Transect "),
		}];
		this.wellLeft = wellLeft;
		this.wellRight = wellRight;
		BaseModel.apply(this, attrs);
	}
});

/*-----  End of Transect  ------*/


/*=================================
=            Transects            =
=================================*/

var Transects = BaseCollection.extend({
	classname: "Transects",
	model: Transect
});

/*-----  End of Transects  ------*/

TransectsCollection = new Transects();