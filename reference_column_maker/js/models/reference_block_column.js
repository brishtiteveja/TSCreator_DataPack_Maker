
/*=============================================================================================
=            ReferenceBlockColumn is a nested collection that contains collection of referenceBlocks            =
=============================================================================================*/

define(["baseModel", "referenceBlocks", "referenceBlockMarkers", "settings"], function(BaseModel, ReferenceBlocks, ReferenceBlockMarkers, Settings) {
	
	var ReferenceBlockColumn = BaseModel.extend({	
		classname: "ReferenceBlockColumn",		
		constructor: function (attributes) {
			var attrs = [{
				x            : attributes.x || 8,
				id           : attributes.id || _.uniqueId("column-"),
				name         : attributes.name || _.uniqueId("Column "),
				width        : 130,
				height       : 1000,
				description  : attributes.description || null,
				blockMarkers : new ReferenceBlockMarkers(),
				blocks       : new ReferenceBlocks(),
				settings     : new Settings(),
			}];
			BaseModel.apply(this, attrs);
		}
	});

	ReferenceBlockColumn.prototype.comparator = function(referenceBlockColumn) {
		return referenceBlockColumn.get('x');
	}

	ReferenceBlockColumn.prototype.toJSON = function() {
		var json = _.clone(this.attributes);
		return json;
	}

	return ReferenceBlockColumn;

});

/*-----  End of ReferenceBlockColumn  ------*/
