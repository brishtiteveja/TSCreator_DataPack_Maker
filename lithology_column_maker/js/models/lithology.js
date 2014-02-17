/*==============================================================================================
=            This is the model for lithology. Lithology is a datapoint in the lithology column.            =
==============================================================================================*/

define(["baseModel", "settings"], function(BaseModel, Settings) {
	
	var Lithology = BaseModel.extend({
		classname: "Lithology",
		constructor: function (attributes, options) {
			var attrs  = [{
				edit: false,
				hover: false,
				name: attributes.name || _.uniqueId("Lithology "),
				description: attributes.description,
				settings: new Settings(),
				top: attributes.top || null,
				base: attributes.base || null,
				lithologyColumn: attributes.lithologyColumn || null,
			}];

			BaseModel.apply(this, attrs);
		}
	});

	Lithology.prototype.initialize = function() {
		this.get('settings').set({
			'backgroundColor': "#FF0000"
		});
	}

	Lithology.prototype.toJSON = function() {
		var json = _.clone(this.attributes);
		delete json["lithologyColumn"];
		return json;
	}

	return Lithology;
});
/*-----  End of Lithology  ------*/

