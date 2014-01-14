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

	FilesView.prototype.initialize = function(files, fileSystem, app) {
		this.app = app;
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
		$('a[href="#save-project"]').click(this.saveProject.bind(this));
	}

	FilesView.prototype.render = function() {
		this.$el.html(this.template.render());
		this.$list = this.$(".list");
		this.files.each(this.addFile.bind(this));
	}

	FilesView.prototype.addFile = function(file) {
		var fileView = new FileView(file, this.files, this.fileSystem, this.app);
		this.$list.append(fileView.el);
	}

	FilesView.prototype.createNewFile = function() {
		var self = this;
		self.fileSystem.get('fs').root.getDirectory(self.fileSystem.get("path"), {}, function(dirEntry) {
			self.newFile(dirEntry, _.uniqueId("new-file-"));
		}, self.errorHandler.bind(self));
	}

	FilesView.prototype.newFile = function(dirEntry, fileName, callback) {
		var self = this;
		dirEntry.getFile(fileName, {create: true, exclusive: true},
			function(fileEntry){self.createFile(fileEntry, callback)},
			self.errorHandler.bind(self));
	}

	FilesView.prototype.createFile = function(fileEntry, callback) {
		var path = this.fileSystem.get('path');
		if (path === "/") {
			path = [""];
		} else {
			path = this.fileSystem.get('path').split("/");
		}
		path.push(fileEntry.name);
		path = path.join("/");
		if (path === fileEntry.fullPath) {
			var file = new File(fileEntry);
			this.files.add(file);	
		}

		if (callback !== undefined) {
			callback(fileEntry);
		}
	}

	FilesView.prototype.createNewDir = function() {
		var self = this;
		self.fileSystem.get('fs').root.getDirectory(self.fileSystem.get("path"), {}, function(dirEntry) {
			self.newDir(dirEntry, _.uniqueId("new-folder-"));
		}, self.errorHandler.bind(self));
	}

	FilesView.prototype.newDir = function(dirEntry, dirName, callback) {
		var self = this;
		dirEntry.getDirectory(dirName, {create: true},
			function(fileEntry){self.createFile(fileEntry, callback)},
			self.errorHandler.bind(self));
	}

	FilesView.prototype.saveProject = function() {
		// create project directory
		$("#loading").removeClass("hide");
		var self = this;
		var dirName =	"transect-" + self.getTimeStamp();
		self.fileSystem.get('fs').root.getDirectory(self.fileSystem.get("path"), {}, function(dirEntry) {
			self.newDir(dirEntry, dirName, function(dirEntry) {
				var jsonFile = "transect.json";
				var textFile = "transect.txt";
				var json = self.app.exporter.getJSON();
				var text = self.app.exporter.getText();

				self.newFile(dirEntry, jsonFile, function(fileEntry){
					self.writeJSONToAFile(fileEntry, json);
					self.newFile(dirEntry, textFile, function(fileEntry){
						self.writeTextToAFile(fileEntry, text);
						$("#loading").addClass("hide");
					});		
				});
			});
		}, self.errorHandler.bind(self));
		
		this.fileSystem.set({
			update: !this.fileSystem.get('update')
		});
	}

	FilesView.prototype.writeJSONToAFile = function(fileEntry, content) {

		var content = content;
		if (fileEntry.isDirectory) return;
		var self = this;

		self.fileSystem.get('fs').root.getFile(fileEntry.fullPath, {create: true}, function(fileEntry) {
			// Create a FileWriter object for our FileEntry.
			fileEntry.createWriter(function(fileWriter) {

				fileWriter.onwriteend = function(e) {
					console.log('Write completed.');
				};

				fileWriter.onerror = function(e) {
					console.log('Write failed: ' + e.toString());
				};

				// Create a new Blob and write it to the file.
				// 
				var blob = new Blob([content], {type: 'application/json'});
				fileWriter.write(blob);

			}, self.errorHandler.bind(this));
		}, self.errorHandler.bind(this));
	}

	FilesView.prototype.writeTextToAFile = function(fileEntry, content) {
		var content = content;
		if (fileEntry.isDirectory) return;
		var self = this;

		self.fileSystem.get('fs').root.getFile(fileEntry.fullPath, {create: true}, function(fileEntry) {
			// Create a FileWriter object for our FileEntry.
			fileEntry.createWriter(function(fileWriter) {

				fileWriter.onwriteend = function(e) {
					console.log('Write completed.');
				};

				fileWriter.onerror = function(e) {
					console.log('Write failed: ' + e.toString());
				};

				// Create a new Blob and write it to the file.
				var blob = new Blob([content], {type: 'text/plain'});
				fileWriter.write(blob);

			}, self.errorHandler.bind(this));
		}, self.errorHandler.bind(this));
	}

	FilesView.prototype.getTimeStamp = function() {
		var date = new Date();
		var dateStr = date.getUTCMonth() + "-" + date.getUTCDate() +"-";
		dateStr += date.getUTCFullYear() + "-" + date.getHours() + "_";
		dateStr += date.getMinutes() + "_" + date.getSeconds();

		return dateStr;
	}
	
	FilesView.prototype.errorHandler = function(e) {
		console.log('Error: ' + e.name + " " + e.message);
	}


	return FilesView;
});

/*-----  End of FilesView  ------*/

