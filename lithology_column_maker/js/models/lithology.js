
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
				id             : _.uniqueId("lithology-id"),
				name           : attributes.name || _.uniqueId("Formation "), // default lithology name changed to "Formation Unique_id" format
				description    : attributes.description,
				memberName	   : attributes.memberName,
				style		   : attributes.base.style || null,
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

    Lithology.prototype.updateZone = function() {
        this.get('top').updateZone();
        this.get('base').updateZone();
    };

	return Lithology;
});
/*-----  End of Lithology  ------*/

