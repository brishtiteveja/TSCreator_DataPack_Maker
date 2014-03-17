
/*============================================================================================================
=            This is the model for lithology. Lithology is a datapoint in the lithology column.              =
============================================================================================================*/

define(["baseModel", "settings"], function(BaseModel, Settings) {
	
	var Lithology = BaseModel.extend({
		classname: "Lithology",
		constructor: function (attributes, app) {
			var attrs  = [{
				edit           : false,
				hover          : false,
				name           : attributes.name || _.uniqueId("Lithology "),
				description    : attributes.description,
				settings       : new Settings(),
				top            : attributes.top || null,
				base           : attributes.base || null,
				lithologyGroup : attributes.lithologyGroup || null,
				patternName    : attributes.patternName || null,
				app            : app || null,
			}];

			BaseModel.apply(this, attrs);
		}
	});

	Lithology.prototype.initialize = function() {
		this.get('settings').set({
			'backgroundColor': "#EEEEEE"
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

