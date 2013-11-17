/*=====================================
=            Pattern Model            =
=====================================*/

var Pattern = BaseModel.extend({
	classname: "Pattern",
	constructor: function(attributes) {
		var attrs = [{
			edit: false,
			name: attributes.name,
			url: attributes.url
		}];
		BaseModel.apply(this, attrs);
	}
});

/*-----  End of Pattern Model  ------*/

/*===========================================
=            Patterns Collection            =
===========================================*/

var Patterns = BaseCollection.extend({
	classname: "Patterns",
	model: Pattern
});

var transectApp = transectApp || {};
transectApp.Patterns = new Patterns();

/*-----  End of Patterns Collection  ------*/



