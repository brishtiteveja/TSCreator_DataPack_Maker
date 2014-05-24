define(["baseModel"], function(BaseModel) {
	var Animation = BaseModel.extend({
		constructor: function(params, options) {
			var attrs = [{
				age: params ? params.age : 0
			}];
			BaseModel.apply(this, attrs);
		}
	});

	return Animation;
});