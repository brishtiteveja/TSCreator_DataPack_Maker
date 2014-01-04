/*======================================================
=            FileSystem for the application            =
======================================================*/

define(["baseModel"], function(BaseModel) {

	var FileSystem = BaseModel.extend({
		classname: "FileSystem",
		constructor: function(attributes, option) {
			var attrs = [{
				fs : attributes.fs,
				path: "/",
			}];
			BaseModel.apply(this, attrs);
		}
	});
	return FileSystem;
});

/*-----  End of FileSystem for the application  ------*/

