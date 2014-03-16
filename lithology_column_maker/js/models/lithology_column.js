
/*=============================================================================================
=            LithologyColumn is a nested collection that contains collection of lithologys            =
=============================================================================================*/

define(["baseModel", "lithologyGroups", "lithologyGroupMarkers", "settings"], function(BaseModel, LithologyGroups, LithologyGroupMarkers, Settings) {
	
	var LithologyColumn = BaseModel.extend({	
		classname: "LithologyColumn",		
		constructor: function (attributes) {
			var attrs = [{
				x                     : attributes.x || 0,
				id                    : _.uniqueId("column-"),
				name                  : attributes.name || _.uniqueId("Column "),
				width                 : parseInt(attributes.width) || 400,
				description           : attributes.description || null,
				lithologyGroupMarkers : new LithologyGroupMarkers(),
				lithologyGroups       : new LithologyGroups(),
				settings              : new Settings(),
			}];
			BaseModel.apply(this, attrs);
		}
	});

	LithologyColumn.prototype.comparator = function(lithologyColumn) {
		return lithologyColumn.get('x');
	}

	LithologyColumn.prototype.toJSON = function() {
		var json = _.clone(this.attributes);
		return json;
	}

	return LithologyColumn;

});

/*-----  End of LithologyColumn  ------*/
