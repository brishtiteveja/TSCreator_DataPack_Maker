define(["baseModel"], function(BaseModel) {
	var Ruler = BaseModel.extend({
		constructor: function(params) {
			var params = params || {};
			var attrs = [{
				top: params.top || 0,
				base: params.base || 10,
				verticalScale: params.verticalScale || 1,
				pixelPerUnit: params.pixelPerUnit || 10,
				units: params.units || "myr",
				width: params.width || 20,
				height: params.height || 0,
				padding: params.height || 50,
			}];

			BaseModel.apply(this, attrs);
		}
	});

	Ruler.prototype.initialize = function() {
		this.updateHeight();
	}

	Ruler.prototype.updateHeight = function() {
		var height = this.getY(this.get('base'));
		this.set({
			height: height
		});
	}

	Ruler.prototype.getY = function(age) {
		var y = (age - this.get('top')) * this.get('pixelPerUnit') * this.get('verticalScale');
		return y;
	}

	Ruler.prototype.getAge = function(Y) {
		var age = this.get('top') + Y / (this.get('pixelPerUnit') * this.get('verticalScale'));
		return age;
	}

	Ruler.prototype.resize = function() {
		this.trigger("resize");
	}

	return Ruler;
});