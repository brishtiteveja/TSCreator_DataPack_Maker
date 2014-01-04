/*================================
=            FileView            =
================================*/

define(["baseView"], function(BaseView) {

	var FileView = BaseView.extend({
		tagName: 'div',
		classname: "FileView",
		events: {
			'dblclick': 'open',
			'click': 'select',
			'blur .file-name': 'blur',
		}
	});

	FileView.prototype.template = new EJS({url: "/file_system/ejs/file.ejs"});

	FileView.prototype.initialize = function(file, files, fileSystem) {
		this.fileSystem = fileSystem;
		this.files = files;
		this.file = file;
		
		this.listenTo(this.file, "change:selected", this.setSelected.bind(this));
		this.listenTo(this.file, "change:name", this.rename.bind(this));
		this.listenToActionEvents();

		this.render();
	}

	FileView.prototype.listenToActionEvents = function() {
		$('a[href="#delete-file"]').click(this.deleteFile.bind(this));
	}

	FileView.prototype.render = function() {
		this.$el.html(this.template.render(this.file.toJSON()));
		this.$file = this.$(".file");
		this.$fileName = this.$(".file-name")[0];
	}

	FileView.prototype.deleteFile = function() {
		var self = this;
		if (!self.file.get('selected')) return;
		if (self.file.get("isFile")) {
			self.fileSystem.get('fs').root.getFile(self.file.get("fullPath"), {}, function(fileEntry) {
				fileEntry.remove(function() {
					console.log('File removed.');
					self.file.destroy();
					self.remove();
				}, self.errorHandler.bind(this));
			}, self.errorHandler.bind(this));
		} else {
			self.fileSystem.get('fs').root.getDirectory(self.file.get('fullPath'), {}, function(dirEntry) {
				dirEntry.removeRecursively(function() {
					console.log('Directory removed.');
					self.file.destroy();
					self.remove();
				}, self.errorHandler.bind(this));
			}, self.errorHandler.bind(this));
		}
	}

	FileView.prototype.select = function() {
		var self = this;
		this.files.each(function(file){
			if (file == self.file) {
				file.set({
					selected: !file.get('selected')
				});	
			} else {
				file.set({
					selected: false
				});	
			}
		});
	}

	FileView.prototype.setSelected = function() {
		if (this.file.get('selected')) {
			this.$file.addClass("active");
		} else {
			this.$file.removeClass("active");
		}
	}


	FileView.prototype.blur = function() {
		this.file.set({
			name: this.$fileName.textContent
		});
	}

	FileView.prototype.rename = function() {
		var self = this;
		if (self.file.get("isFile")) {
			self.fileSystem.get('fs').root.getFile(self.file.get("fullPath"), {}, function(fileEntry) {
				var path = self.file.get("fullPath").split("/");
				path.pop();
				path = path.join("/");
				if (path === "") {
					path = "/";
				}
				self.fileSystem.get('fs').root.getDirectory(path, {}, function(dirEntry) {
					fileEntry.moveTo(dirEntry, self.file.get("name"));
				}, self.errorHandler.bind(this));
			}, self.errorHandler.bind(this));
		} else {
			self.fileSystem.get('fs').root.getDirectory(self.file.get("fullPath"), {}, function(fileEntry) {
				var path = self.file.get("fullPath").split("/");
				path.pop();
				path = path.join("/");
				if (path === "") {
					path = "/";
				}
				self.fileSystem.get('fs').root.getDirectory(path, {}, function(dirEntry) {
					fileEntry.moveTo(dirEntry, self.file.get("name"));
				}, self.errorHandler.bind(this));
			}, self.errorHandler.bind(this));
		}
	}

	FileView.prototype.open = function() {
		var self = this;
		if (self.file.get('isFile')) {

		} else {
			this.fileSystem.set({
				path: this.file.get('fullPath')
			});
		}
	}
	
	FileView.prototype.errorHandler = function(e) {
		var msg = 'Unknown Error' + e.name;
		console.log('Error: ' + msg);
	}


	return FileView;
});

/*-----  End of FileView  ------*/

