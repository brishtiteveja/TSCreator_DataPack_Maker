/*================================
=            Transect            =
================================*/

define(["baseModel", "settings"], function(BaseModel, Settings) {
	var Transect = BaseModel.extend({
		classname: "Transect",
		constructor: function(attributes, wellLeft, wellRight) {
			var attrs = [{
				name: attributes.name || _.uniqueId("Transect-"),
				id: _.uniqueId("transect-"),
				description: attributes.description || null,
				wellLeft: wellLeft,
				wellRight: wellRight,
				settings: new Settings(),
				width: 500,
				status: "on",
			}];
			BaseModel.apply(this, attrs);
		}
	});

	Transect.prototype.isXInsideTransect = function(x) {
		if (this.get('wellLeft').get('x') <= x && x < this.get('wellRight').get('x')) {
			return true;
		}
		return false;
	}

	Transect.prototype.getRelativeX = function(x) {
		if (this.get('wellLeft').get('x') <= x && x < this.get('wellRight').get('x')) {
			var num = ((x - this.get('wellLeft').get('x'))/(this.get('wellRight').get('x') - this.get('wellLeft').get('x')))
			return Math.round(num * 100) / 100;
		}
		return null;
	}

	Transect.prototype.getPolyKPointsArray = function() {
		return ([this.get('wellLeft').get('x'), 0,
			this.get('wellRight').get('x'), 0,
			this.get('wellRight').get('x'), transectApp.Canvas.height,
			this.get('wellLeft').get('x'), transectApp.Canvas.height]);
	}

	return Transect;
});

/*-----  End of Transect  ------*/

