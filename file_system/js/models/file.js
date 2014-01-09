/*============================
=            File            =
============================*/

define(["baseModel"], function(BaseModel) {

	var File = BaseModel.extend({
		classname: "File",
		constructor: function(fileEntry, options) {
			var attrs = [{
				name: fileEntry.name,
				isFile: fileEntry.isFile,
				isDirectory: fileEntry.isDirectory,
				size: fileEntry.Size || 0,
				fullPath: fileEntry.fullPath,
				url: fileEntry.toURL(),
				selected: false,
				type: null,
			}];
			BaseModel.apply(this, attrs);
		}
	});

	File.prototype.initialize = function() {
		var ext = this.get('name').split('.').pop();
		this.set({
			type: ext
		});
	}

	return File;
});

/*-----  End of File  ------*/

