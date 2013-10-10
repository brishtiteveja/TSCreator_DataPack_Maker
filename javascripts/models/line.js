/*==================================
=            Line Model            =
==================================*/

var Line = BaseModel.extend({
	classname: "Line",
	constructor: function(attributes, point1, point2) {
		var attrs = [{
			edit: false,
			name: attributes.name || _.uniqueId("Line ")
		}];
		this.point1 = point1;
		this.point2 = point2;
		this.settings = new Settings();
		BaseModel.apply(this, attrs);
	}
});


/*-----  End of Lime Model  ------*/

/*========================================
=            Lines Collection            =
========================================*/

var Lines = BaseCollection.extend({
	classname: "Lines",
	model: Line
});

/*-----  End of Lines Collection  ------*/
