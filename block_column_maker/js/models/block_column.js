
/*=============================================================================================
=            BlockColumn is a nested collection that contains collection of blocks            =
=============================================================================================*/

define(["baseModel", "blocks", "blockMarkers", "settings"], function(BaseModel, Blocks, BlockMarkers, Settings) {
	
	var BlockColumn = BaseModel.extend({	
		classname: "BlockColumn",		
		constructor: function (attributes) {
			var attrs = [{
				x            : attributes.x || 0,
				id           : _.uniqueId("column-"),
				name         : attributes.name || _.uniqueId("Column "),
				width        : parseInt(attributes.width) || 200,
				description  : attributes.description || null,
				blockMarkers : new BlockMarkers(),
				blocks       : new Blocks(),
				settings     : new Settings(),
			}];
			BaseModel.apply(this, attrs);
		}
	});

	BlockColumn.prototype.comparator = function(blockColumn) {
		return blockColumn.get('x');
	}

	BlockColumn.prototype.toJSON = function() {
		var json = _.clone(this.attributes);
		delete json["blockMarkers"];
		return json;
	}

	return BlockColumn;

});

/*-----  End of BlockColumn  ------*/
