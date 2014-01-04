/*============================
=            File            =
============================*/

define(["baseModel"], function(BaseModel) {

	var File = BaseModel.extend({
		classname: "File",
		constructor: function(attributes, options) {
			var attrs = [{
				name: attributes.name,
				isFile: attributes.isFile,
				isDirectory: attributes.isDirectory,
				size: attributes.size || 0,
				fullPath: attributes.fullPath,
				selected: false
			}];
			BaseModel.apply(this, attrs);
		}
	});

	return File;
});

/*-----  End of File  ------*/

