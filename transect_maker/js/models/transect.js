define(["baseModel", "settings"], function(BaseModel, Settings) {
	var Transect = BaseModel.extend({
		classname: "Transect",
		constructor: function(attributes, wellLeft, wellRight, app) {
			this.app = app;
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
		if (this.get('wellLeft').get('x') < x && x < this.get('wellRight').get('x')) {
			return true;
		}
		return false;
	}

	Transect.prototype.getAbsoluteX = function(relX) {
		var x = this.get('wellLeft').get('x') + (this.get('wellRight').get('x') - this.get('wellLeft').get('x')) * relX;
		return x;
	}

	Transect.prototype.getRelativeX = function(x) {
		if (this.get('wellLeft').get('x') < x && x < this.get('wellRight').get('x')) {
			var num = ((x - this.get('wellLeft').get('x')) / (this.get('wellRight').get('x') - this.get('wellLeft').get('x')));
			return Math.round(num * 1000) / 1000;
		}
		return null;
	}

	Transect.prototype.getPolyKPointsArray = function() {
		return ([this.get('wellLeft').get('x') - 2, 0,
			this.get('wellRight').get('x') + 2, 0,
			this.get('wellRight').get('x') + 2, this.app.height,
			this.get('wellLeft').get('x') - 2, this.app.height
		]);
	}

	return Transect;
});