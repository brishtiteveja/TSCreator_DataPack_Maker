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

	FileSystemView.prototype.initialize = function(app) {
		this.app = app;

		this.$canvas = $("#canvas");
		var oneGB = 1024*1024*1024;
		// requesting a file system
		if (navigator && navigator.webkitPersistentStorage) {
			navigator.webkitPersistentStorage.requestQuota(oneGB, this.requestFileSystem.bind(this), this.errorHandler.bind(this));	
		}
	}

	FileSystemView.prototype.requestFileSystem = function(size) {
		window.webkitRequestFileSystem(webkitStorageInfo.PERSISTENT, size, this.render.bind(this), this.errorHandler.bind(this));
	}

	FileSystemView.prototype.updateQuota = function() {
		var self = this;
		window.webkitStorageInfo.queryUsageAndQuota(webkitStorageInfo.PERSISTENT, //the type can be either TEMPORARY or PERSISTENT
		function(used, remaining) {
			self.$quota.html("Used " + parseInt(used/100000)/10 + " mb of " + parseInt(remaining/100000)/10  + " mb.");
		}, self.errorHandler.bind(self));
	}

	FileSystemView.prototype.render = function(fs) {
		this.fileSystem = new FileSystem({fs: fs});

		this.renderDirs();
		this.listenTo(this.fileSystem, "change:path", this.renderDirs.bind(this));
		this.listenTo(this.fileSystem, "change:update", this.renderDirs.bind(this));
		
	}

	FileSystemView.prototype.renderDirs = function() {
		this.$el.html(this.template.render(this.fileSystem.toJSON()));
		this.$quota = this.$(".quota");
		var self = this;
		var path = this.fileSystem.get('path');
		this.files = new Files();
		this.filesView = new FilesView(this.files, this.fileSystem, this.app);
		this.fileSystem.get('fs').root.getDirectory(path, {}, function(dirEntry) {
			if (dirEntry.isDirectory) {
				var dirReader = dirEntry.createReader();
				dirReader.readEntries(self.readDir.bind(self));
			}
		}, self.errorHandler);

		this.readDir();
		this.updateQuota();
	}

	FileSystemView.prototype.readDir = function(results) {
		var self = this;
		if ((results === undefined) || (!results.length)) return;
		if (self.fileSystem.get('update')) {
			self.fileSystem.set({
				'update': false
			});
			return;
		}

		results.forEach(function(fileEntry) {
			var file = new File(fileEntry);
			fileEntry.getMetadata(function(metadata) {
				file.updateFileData(metadata);
				self.files.add(file);
			});
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
			$(".display-panel").addClass('hide');
			this.$canvas.removeClass('hide');
		} else {
			$(".maker-tools").parent().removeClass('active');
			$("a[href='#file-system']").parent().addClass('active');
			$(".display-panel").addClass('hide');
			this.$el.removeClass('hide');
			this.app.exporter.export();
		}
	};

	FileSystemView.prototype.errorHandler = function(e) {
		console.log('Error: ' + e.name + " " + e.message);
	}

	return FileSystemView;
});

/*-----  End of FileSystemView  ------*/

