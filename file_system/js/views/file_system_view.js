define([
    "jszip",
    "filesaver",
    "baseView",
    "file",
    "files",
    "filesView",
    "fileSystem"
], function (
    JSZip,
    FileSaver,
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
            "click a[href='#compress-file']": "compress",
            "click a.path-breadcrumb": "setDir",
        }
    });

    FileSystemView.prototype.template = new EJS({
        url: "../../file_system/ejs/file_system_panel.ejs"
    });

    FileSystemView.prototype.initialize = function (app) {
        this.app = app;

        this.$canvas = $("#canvas");
        var oneGB = 1024 * 1024 * 1024;
        // requesting a file system
        if (navigator && navigator.webkitPersistentStorage) {
            navigator.webkitPersistentStorage.requestQuota(oneGB, this.requestFileSystem.bind(this), this.errorHandler
                .bind(this));
        }

    };

    FileSystemView.prototype.requestFileSystem = function (size) {
        window.webkitRequestFileSystem(navigator.webkitPersistentStorage, size, this.render.bind(this), this.errorHandler
            .bind(this));
    };

    FileSystemView.prototype.updateQuota = function () {
        var self = this;
        navigator.webkitPersistentStorage.requestQuota(navigator.webkitPersistentStorage, //the type can be either TEMPORARY or PERSISTENT
            function (used, remaining) {
                self.$quota.html("Used " + parseInt(used / 100000) / 10 + " mb of " + parseInt(remaining / 100000) /
                    10 + " mb.");
            }, self.errorHandler.bind(self));
    };

    FileSystemView.prototype.clearFiles = function () {
        var path = this.fileSystem.get('path');
	console.log(path);
        this.fileSystem.get('fs').root.getDirectory(path, {}, function (dirEntry) {
                dirEntry.removeRecursively(function () {
                    window.console.log('Directory removed.');
                    self.file.destroy();
                    self.fileSystem.update();
                }, self.errorHandler.bind(this));
            }, self.errorHandler.bind(this));
    }

    FileSystemView.prototype.render = function (fs) {
        this.fileSystem = new FileSystem({
            fs: fs
        });

        this.renderDirs();
        this.listenTo(this.fileSystem, "update", this.renderDirs.bind(this));
        this.listenTo(this.fileSystem, 'Compress', this.compressDirEntry);
        this.listenTo(this.fileSystem, 'error', this.compressDirEntry);

    };

    FileSystemView.prototype.renderDirs = function () {
        this.$el.html(this.template.render(this.fileSystem.toJSON()));
        this.$quota = this.$(".quota");
        var self = this;
        var path = this.fileSystem.get('path');
        this.files = new Files();
        this.filesView = new FilesView(this.files, this.fileSystem, this.app);
        this.fileSystem.get('fs').root.getDirectory(path, {}, function (dirEntry) {
            if (dirEntry.isDirectory) {
                var dirReader = dirEntry.createReader();
                dirReader.readEntries(self.readDir.bind(self));
            }
        }, self.errorHandler);

        this.updateQuota();
    };

    FileSystemView.prototype.compress = function () {
        var self = this;
        var path = this.fileSystem.get('path');
        self.fileSystem.get('fs').root.getDirectory(path, {}, function (dirEntry) {
            if (dirEntry.isDirectory) {
                self.compressDirEntry(dirEntry);
            }
        }, self.errorHandler);
    };

    FileSystemView.prototype.compressDirEntry = function (dirEntry) {
        var zip = new JSZip();
	if(dirEntry != null)
            var dirReader = dirEntry.createReader();
	if (dirReader != null) 
            dirReader.readEntries(this.compressDir.bind(this, dirEntry, zip));
    };

    FileSystemView.prototype.compressDir = function (dirEntry, zip, results) {
        var self = this;
        var zipName = dirEntry.name;
        if ((results === undefined) || (!results.length)) return;
        var count = results.length;
        results.forEach(function (fileEntry) {
            if (fileEntry.isFile) {
                fileEntry.file(function (f) {
                    // Get file and read it into zip
                    var reader = new FileReader();

                    reader.onload = (function (fileToRead) {
                        return function (e) {

                            if (fileToRead.type.match('image*')) {
                                zip.file(fileToRead.name, self.base64ToBinary(e.target.result));
                            } else if (fileToRead.type.match('text*') || fileToRead.name.match(
                                '.*json$')) {
                                zip.file(fileToRead.name, e.target.result);
                            }
                        };
                    })(f);

                    reader.onloadend = function () {
                        count--;
                        if (count === 0) {
                            self.compressionComplete(zipName, zip);
                        }
                    };

                    if (f.type.match('image*')) {
                        reader.readAsDataURL(f);
                    } else if (f.type.match('text*') || f.name.match(".*json$")) {
                        reader.readAsText(f);
                    }
                });
            }
        });
    };

    FileSystemView.prototype.compressionComplete = function (zipName, zip) {
        var content = zip.generate({
            type: "blob"
        });
        window.saveAs(content, zipName + ".zip");
    };

    FileSystemView.prototype.readDir = function (results) {
        var self = this;
        self.files.reset();
        if ((results === undefined) || (!results.length)) return;
        results.forEach(function (fileEntry) {
            var file = new File(fileEntry);
            fileEntry.getMetadata(function (metadata) {
                file.updateFileData(metadata);
                self.files.add(file);
            });
        });
    };

    FileSystemView.prototype.parentDir = function () {
        var path = this.fileSystem.get('path');
        if (path === "/") {
            return;
        } else {
            path = path.split("/");
            path.pop();
            path = path.join("/");
            this.fileSystem.set({
                path: path
            });
        }
    };

    FileSystemView.prototype.setDir = function (evt) {
        var path = $(evt.target).attr("path");
        if (path === "") {
            path = "/";
        }
        this.fileSystem.set({
            path: path
        });
        this.fileSystem.update();
    };

    FileSystemView.prototype.toggleView = function () {
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

    FileSystemView.prototype.errorHandler = function (e) {
        window.console.log('Error: ' + e.name + " " + e.message);
    };

    FileSystemView.prototype.saveFile = function (obj, file) {
        this.filesView.saveFile(obj, file);
    };

    FileSystem.prototype.saveError = function(message) {
        window.alert(message);
    };

    return FileSystemView;
});
