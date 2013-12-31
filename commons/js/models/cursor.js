/*==============================
=            Cursor            =
==============================*/

define(["baseModel"], function(BaseModel) {
	var Cursor = BaseModel.extend({
		constructor: function(attributes, options) {
			var attrs = [{
				lockH: false,
				lockV: false,
			}];

			BaseModel.apply(this, attrs);
		}
	});

	return Cursor;
});

/*-----  End of Cursor  ------*/

