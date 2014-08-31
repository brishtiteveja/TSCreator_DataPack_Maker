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
				update: false,
			}];
			BaseModel.apply(this, attrs);
		}
	});

    FileSystem.prototype.writeCompleted = function(path) {
        this.trigger('write-completed', path);
    };


    FileSystem.prototype.writeErrored = function(path) {
        this.trigger('write-errored', path);
    };

	return FileSystem;
});

/*-----  End of FileSystem for the application  ------*/

