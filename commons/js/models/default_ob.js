define(["baseModel"], function(BaseModel) {
	window.tscApp = window.tscApp || {};

	window.tscApp.Scheme = {
		TIMELINES: 1,
		RULER: 2
	}

	var DefaultOb = BaseModel.extend({
		constructor: function(params, options) {
			var attrs = [{
				age: params ? params.age : 0,
				top: params ? params.top : 0,
				base: params ? params.base : 0,
				scheme: params ? params.scheme : tscApp.Scheme.TIMELINES,
				units: params ? params.units : "myr",
				pixPerUnit: params ? params.pixPerUnit : 10,
				verticalScale: params ? params.verticalScale : 1,
			}];
			BaseModel.apply(this, attrs);
		}
	});

	return DefaultOb;
});