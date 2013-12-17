/*====================================
=            TransectText            =
====================================*/

var TransectText = BaseModel.extend({
	classname: "TransectText",
	constructor: function(attributes, options) {
		var attrs = [{
			edit: false,
			text: attributes.text || _.uniqueId("Text "),
			x: attributes.x ? parseInt(attributes.x) : 0,
			y: attributes.y ? parseInt(attributes.y) : 0,
			age: null,
			relativeX: null,
			transect: null,
		}];
		BaseModel.apply(this, attrs);
	}
});

/*-----  End of TransectText  ------*/

/*================================================
=            TransectTexts Collection            =
================================================*/

var TransectTexts = BaseCollection.extend({
	classname: "TransectTexts",
	model: TransectText
});

/*-----  End of TransectTexts Collection  ------*/

var transectApp = transectApp || {};
transectApp.TransectTextsCollection = new TransectTexts();
