define(["baseModel"], function(BaseModel) {
	var Animation = BaseModel.extend({
		constructor: function(params, options) {
			var attrs = [{
				age: params ? params.age : 0,
				top: params ? params.top : 0,
				base: params ? params.base : 0,
				step: params ? params.step : 0.1,
			}];
			BaseModel.apply(this, attrs);
		}
	});

	return Animation;
});