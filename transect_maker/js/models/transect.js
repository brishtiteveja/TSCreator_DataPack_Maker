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

Transect.prototype.isXInsideTransect = function(x) {
	if (this.wellLeft.get('x') <= x && x <= this.wellRight.get('x')) {
		return true;
	}
	return false;
}

Transect.prototype.getRelativeX = function(x) {
	if (this.wellLeft.get('x') <= x && x <= this.wellRight.get('x')) {
		var num = ((x - this.wellLeft.get('x'))/(this.wellRight.get('x') - this.wellLeft.get('x')))
		return Math.round(num * 100) / 100;
	}
	return null;
}

/*-----  End of Transect  ------*/


/*=================================
=            Transects            =
=================================*/

var Transects = BaseCollection.extend({
	classname: "Transects",
	model: Transect
});

Transects.prototype.getTransectForX = function(x) {
	/* return the transect to which the point belongs to */
	var containingTransect = null;
	this.each(function(transect) {
		if (transect.isXInsideTransect(x)) {
			containingTransect = transect;
		}
	});
	return containingTransect;
}

/*-----  End of Transects  ------*/

var transectApp = transectApp || {};
transectApp.TransectsCollection = new Transects();