
/*===========================================================================================================
=            Reference Column contains reference column that will be displayed for other makers.            =
===========================================================================================================*/

define(["baseModel", "referenceBlockColumn"], function(BaseModel, ReferenceBlockColumn) {
	
	var ReferenceColumn = BaseModel.extend({	
		classname: "ReferenceColumn",		
		constructor: function (attributes) {
			var attrs = [{
				column      : attributes.column || null,
				top         : attributes.top || null,
				base        : attributes.base || null,
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
