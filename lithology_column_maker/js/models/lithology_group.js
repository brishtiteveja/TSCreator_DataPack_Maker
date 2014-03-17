/*===============================================================================================================
=            This is the model for lithology. LithologyGroup is a datapoint in the lithology column.            =
===============================================================================================================*/

define(["baseModel", "settings", "lithologys", "lithologyMarkers"], function(BaseModel, Settings, Lithologys, LithologyMarkers) {
	
	var LithologyGroup = BaseModel.extend({
		classname: "LithologyGroup",
		constructor: function (attributes, options) {
			var attrs  = [{
				edit             : false,
				hover            : false,
				name             : attributes.name || _.uniqueId("Group "),
				description      : attributes.description,
				settings         : new Settings(),
				top              : attributes.top || null,
				base             : attributes.base || null,
				lithologyColumn  : attributes.lithologyColumn || null,
				lithologyMarkers : new LithologyMarkers(),
				lithologys       : new Lithologys()
			}];

			BaseModel.apply(this, attrs);
		}
	});

	LithologyGroup.prototype.initialize = function() {
		this.get('settings').set({
			'backgroundColor': "#FFFFFF"
		});
	}

	LithologyGroup.prototype.toJSON = function() {
		var json = _.clone(this.attributes);
		delete json["lithologyColumn"];
		return json;
	}

	return LithologyGroup;
});
/*-----  End of LithologyGroup  ------*/

