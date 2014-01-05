/*======================================
=            FileSystemView            =
======================================*/

define([
	"baseView",
	"file",
	"files",
	"filesView",
	"fileSystem"
	], function(
		BaseView,
		File,
		Files,
		FilesView,
		FileSystem
		) {

	var FileSystemView = BaseView.extend({
		classname: "FileSystemView",
		el: "#file-system-panel",
		events: {
			"click a[href='#parent-dir']": "parentDir",
			"click a.path-breadcrumb": "setDir",
		}
	});

	FileSystemView.prototype.template = new EJS({url: "/file_system/ejs/file_system_panel.ejs"});

	FileSystemView.prototype.initialize = function() {
		var oneGB = 1024*1024*1024;
		// requesting a file system
		navigator.webkitPersistentStorage.requestQuota(oneGB, this.requestFileSystem.bind(this), this.errorHandler.bind(this));
	}

	FileSystemView.prototype.requestFileSystem = function(size) {
		window.webkitRequestFileSystem(window.PERSISTANT, size, this.render.bind(this), this.errorHandler.bind(this));
	}

	FileSystemView.prototype.render = function(fs) {
		this.fileSystem = new FileSystem({fs: fs});
		this.$canvas = $("#canvas");

		this.renderDirs();
		this.listenTo(this.fileSystem, "change:path", this.renderDirs.bind(this));
	}

	FileSystemView.prototype.renderDirs = function() {
		this.$el.html(this.template.render(this.fileSystem.toJSON()));
		var self = this;
		var path = this.fileSystem.get('path');
		this.files = new Files();
		this.filesView = new FilesView(this.files, this.fileSystem);
		this.fileSystem.get('fs').root.getDirectory(path, {}, function(dirEntry) {
			if (dirEntry.isDirectory) {
				var dirReader = dirEntry.createReader();
				dirReader.readEntries(self.readDir.bind(self));
			}
		}, self.errorHandler);

		this.readDir();
	}

	FileSystemView.prototype.readDir = function(results) {
		var self = this;
		if ((results === undefined) || (!results.length)) return;
		results.forEach(function(fileEntry) {
			self.files.add(new File(fileEntry));
		});
	}

	FileSystemView.prototype.parentDir = function() {
		var path = this.fileSystem.get('path');
		if (path === "/") {
			return;
		} else {
			path = path.split("/");
			path.pop();
			path = path.join("/")
			this.fileSystem.set({
				path: path
			});
		}
	}

	FileSystemView.prototype.setDir = function(evt) {
		var path = $(evt.target).attr("path");
		if (path === "") {
			path = "/"
		}
		this.fileSystem.set({
			path: path
		});
	}

	FileSystemView.prototype.toggleView = function(evt) {
		if ($("a[href='#file-system']").parent().hasClass('active')) {
			$("a[href='#file-system']").parent().removeClass('active');
			this.$el.addClass('hide');
			this.$canvas.removeClass('hide');
		} else {
			$("a[href='#file-system']").parent().addClass('active');
			this.$el.removeClass('hide');
			this.$canvas.addClass('hide');
			transectApp.exporter.export();
		}
	};

	FileSystemView.prototype.errorHandler = function(e) {
		console.log('Error: ' + e.name + " " + e.message);
	}

	return FileSystemView;
});

/*-----  End of FileSystemView  ------*/

