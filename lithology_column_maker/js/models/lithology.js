
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
				pattern        : attributes.pattern || null,
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
		delete json["lithologyGroup"];
		delete json["app"];
		return json;
	}

	Lithology.prototype.getPatternName = function() {
		if (this.get('pattern')) {
			return this.get('app').patternsData[this.get('pattern')].name;
		}
		return null;
	}

	return Lithology;
});
/*-----  End of Lithology  ------*/

