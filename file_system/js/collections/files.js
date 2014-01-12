/*=============================
=            Files            =
=============================*/

define(["baseCollection", "file"], function(BaseCollection, File) {
	var Files = BaseCollection.extend({
		classname: "Files",
		model: File,
	});

	Files.prototype.comparator = function(file) {
		return  -file.get("modificationTime");
	}

	return Files;
});

/*-----  End of Files  ------*/

