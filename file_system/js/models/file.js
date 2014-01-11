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
				size: 0,
				modificationTime: null,
			}];
			BaseModel.apply(this, attrs);
		}
	});

	File.prototype.initialize = function(fileEntry, options) {
		var ext = this.get('name').split('.').pop();
		this.set({
			type: ext
		});
	}

	File.prototype.updateFileData = function(metadata) {
		var date  =  new Date(metadata.modificationTime);
		this.set({
			size: metadata.size,
			modificationTime: date.getTime(),
		});
	}

	return File;
});

/*-----  End of File  ------*/

