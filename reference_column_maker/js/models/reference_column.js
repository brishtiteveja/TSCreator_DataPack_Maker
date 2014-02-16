
/*===========================================================================================================
=            Reference Column contains reference column that will be displayed for other makers.            =
===========================================================================================================*/

define(["baseModel", "referenceBlockColumn"], function(BaseModel, ReferenceBlockColumn) {
	
	var ReferenceColumn = BaseModel.extend({	
		classname: "ReferenceColumn",		
		constructor: function (attributes) {
			var attrs = [{
				columnId    : attributes.columnId || "none",
				column      : attributes.column || null,
				top         : attributes.top || 0,
				base        : attributes.base || 15,
				columnsData : attributes.columnsData || null,
			}];
			BaseModel.apply(this, attrs);
		}
	});

	ReferenceColumn.prototype.toJSON = function() {
		var json = _.clone(this.attributes);
		return json;
	}

	return ReferenceColumn;

});

/*-----  End of ReferenceColumn  ------*/
