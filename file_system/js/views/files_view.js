/*=================================
=            FilesView            =
=================================*/

define(["baseView", "fileView", "file"], function (BaseView, FileView, File) {

	var FilesView = BaseView.extend({
		classname: "FilesView",
		el: "#files-list",
		events: {
		}
	});

	FilesView.prototype.template = new EJS({url: "/file_system/ejs/files.ejs"});

	FilesView.prototype.initialize = function(files, fileSystem) {
		this.fileSystem = fileSystem;
		this.files = files;

		this.listenTo(this.files, "add", this.render.bind(this));
		this.listenTo(this.files, "remove", this.render.bind(this));

		this.listenToActionEvents();
		this.render();
	}

	FilesView.prototype.listenToActionEvents = function(evt) {
		$('a[href="#create-file"]').unbind().click(this.createNewFile.bind(this));
		$('a[href="#create-dir"]').unbind().click(this.createNewDir.bind(this));
	}

	FilesView.prototype.render = function() {
		this.$el.html(this.template.render());
		this.$list = this.$(".list");
		this.files.each(this.addFile.bind(this));
	}

	FilesView.prototype.addFile = function(file) {
		var fileView = new FileView(file, this.files, this.fileSystem);
		this.$list.append(fileView.el);
	}

	FilesView.prototype.createNewFile = function() {
		var absolutePath = this.fileSystem.get('path')
		var path = absolutePath.split("/");
		path.push(_.uniqueId("New File "));
		absolutePath = path.join("/");
		this.fileSystem.get('fs').root.getFile(absolutePath, {create: true, exclusive: true}, this.createFile.bind(this), this.errorHandler.bind(this));
	}

	FilesView.prototype.createFile = function(fileEntry) {
		var file = new File(fileEntry);
		this.files.add(file);
	}

	FilesView.prototype.createNewDir = function() {
		var absolutePath = this.fileSystem.get('path') + _.uniqueId("New Directory ");
		var absolutePath = this.fileSystem.get('path')
		var path = absolutePath.split("/");
		path.push(_.uniqueId("New File "));
		absolutePath = path.join("/");
		this.fileSystem.get('fs').root.getDirectory(absolutePath, {create: true}, this.createFile.bind(this), this.errorHandler.bind(this));
	}
	
	FilesView.prototype.errorHandler = function(e) {
		var msg = '';

		switch (e.code) {
			case FileError.QUOTA_EXCEEDED_ERR:
				msg = 'QUOTA_EXCEEDED_ERR';
				break;
			case FileError.NOT_FOUND_ERR:
				msg = 'NOT_FOUND_ERR';
				break;
			case FileError.SECURITY_ERR:
				msg = 'SECURITY_ERR';
				break;
			case FileError.INVALID_MODIFICATION_ERR:
				msg = 'INVALID_MODIFICATION_ERR';
				break;
			case FileError.INVALID_STATE_ERR:
				msg = 'INVALID_STATE_ERR';
				break;
			default:
				msg = 'Unknown Error' + e.message;
				break;
		}

		console.log('Error: ' + msg);
	}


	return FilesView;
});

/*-----  End of FilesView  ------*/

