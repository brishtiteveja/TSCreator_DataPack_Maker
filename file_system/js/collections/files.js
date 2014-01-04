/*=============================
=            Files            =
=============================*/

define(["baseCollection", "file"], function(BaseCollection, File) {
	var Files = BaseCollection.extend({
		classname: "Files",
		model: File,
	});

	return Files;
});

/*-----  End of Files  ------*/

