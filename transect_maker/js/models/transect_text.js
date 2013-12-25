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
			age: 0,
			relativeX: null,
			relativeY: null,
			transect: null,
			zone: null,
		}];
		BaseModel.apply(this, attrs);
	}
});

TransectText.prototype.initialize = function() {
	this.updateTransectAndZone();
}

TransectText.prototype.updateTransectAndZone = function() {
	var zone = transectApp.ZonesCollection.getZoneForY(this.get('y'));
	var transect = transectApp.TransectsCollection.getTransectForX(this.get('x'));
	if (zone !== null && transect !== null) {
		this.set({
			transect: transect,
			zone: zone
		});	
		this.updateRelativeCoordinates();
	}
}

TransectText.prototype.updateRelativeCoordinates = function(arguments) {
	this.set({
		relativeX: this.get('transect').getRelativeX(this.get('x')),
		relativeY: this.get('zone').getRelativeY(this.get('y')),
		age: this.get('zone').getAbsoluteAge(this.get('y'))
	});
}

/*-----  End of TransectText  ------*/

/*================================================
=            TransectTexts Collection            =
================================================*/

var TransectTexts = BaseCollection.extend({
	classname: "TransectTexts",
	model: TransectText
});

TransectTexts.prototype.updateTransectTexts = function() {
	this.each(function(transect) {
		transect.updateTransectAndZone();
	});
	return true;
}

/*-----  End of TransectTexts Collection  ------*/

var transectApp = transectApp || {};
transectApp.TransectTextsCollection = new TransectTexts();
