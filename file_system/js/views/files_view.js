define([
        "baseView",
        "fileView",
        "file"
    ],
    function (
        BaseView,
        FileView,
        File) {

        var FilesView = BaseView.extend({
            classname: "FilesView",
            el: "#files-list",
            events: {}
        });

        FilesView.prototype.template = new EJS({
            url: "/file_system/ejs/files.ejs"
        });

        FilesView.prototype.initialize = function (files, fileSystem, app) {
            this.app = app;
            this.fileSystem = fileSystem;
            this.files = files;

            this.listenTo(this.files, "add", this.render);
            this.listenTo(this.files, "remove", this.delFile);

            this.listenToActionEvents();
            this.render();
        };

        FilesView.prototype.listenToActionEvents = function () {
            $('a[href="#create-file"]').unbind().click(this.createNewFile.bind(this));
            $('a[href="#create-dir"]').unbind().click(this.createNewDir.bind(this));
            $('a[href="#save-project"]').click(this.saveProject.bind(this));
            $('a[href="#download-project').click(this.downloadProject.bind(this));
        };

        FilesView.prototype.render = function () {
            this.$el.html(this.template.render());
            this.$list = this.$(".list");
            this.files.each(this.addFile.bind(this));
        };

        FilesView.prototype.addFile = function (file) {
            var fileView = new FileView(file, this.files, this.fileSystem, this.app);
            this.$list.append(fileView.el);
        };

        FilesView.prototype.createNewFile = function () {
            var self = this;
            self.fileSystem.get('fs').root.getDirectory(self.fileSystem.get("path"), {}, function (dirEntry) {
                self.newFile(dirEntry, _.uniqueId("new-file-"));
            }, self.errorHandler.bind(self));
        };

        FilesView.prototype.newFile = function (dirEntry, fileName, callback) {
            var self = this;
            dirEntry.getFile(fileName, {
                    create: true,
                    exclusive: true
                },
                function (fileEntry) {
                    self.createFile(fileEntry, callback);
                },
                self.errorHandler.bind(self));
        };

        FilesView.prototype.createFile = function (fileEntry, callback) {
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
        };

        FilesView.prototype.createNewDir = function () {
            var self = this;
            self.fileSystem.get('fs').root.getDirectory(self.fileSystem.get("path"), {}, function (dirEntry) {
                self.newDir(dirEntry, _.uniqueId("new-folder-"));
            }, self.errorHandler.bind(self));
        };

        FilesView.prototype.newDir = function (dirEntry, dirName, callback) {
            var self = this;
            dirEntry.getDirectory(dirName, {
                    create: true
                },
                function (fileEntry) {
                    self.createFile(fileEntry, callback);
                },
                self.errorHandler.bind(self));
        };

        FilesView.prototype.downloadProject = function () {
            // create project directory
            var self = this;
            var timeStamp = self.getTimeStamp();
            var dirName = this.app.type + "-" + timeStamp;
            self.fileSystem.get('fs').root.getDirectory(self.fileSystem.get("path"), {}, function (dirEntry) {
                self.newDir(dirEntry, dirName, function (dirEntry) {
                    var jsonFile = self.app.type + "-data-" + timeStamp + ".json";
                    var textFile = self.app.type + "-data-" + timeStamp + ".txt";
                    var json = self.app.exporter.getJSON();
                    var text = self.app.exporter.getText();

                    self.newFile(dirEntry, jsonFile, function (fileEntry) {
                        self.writeJSONToAFile(fileEntry, json);
                        self.newFile(dirEntry, textFile, function (fileEntry) {
                            self.writeTextToAFile(fileEntry, text);
                            self.fileSystem.set({
                                update: !self.fileSystem.get('update')
                            });
                            self.fileSystem.trigger('Compress', dirEntry);
                        });
                    });
                });
            }, self.errorHandler.bind(self));
        };

        FilesView.prototype.saveProject = function () {
            // create project directory
            var self = this;
            var timeStamp = self.getTimeStamp();
            var dirName = this.app.type + "-" + timeStamp;
            self.fileSystem.get('fs').root.getDirectory(self.fileSystem.get("path"), {}, function (dirEntry) {
                self.newDir(dirEntry, dirName, function (dirEntry) {
                    var jsonFile = self.app.type + "-data-" + timeStamp + ".json";
                    var textFile = self.app.type + "-data-" + timeStamp + ".txt";
                    var json = self.app.exporter.getJSON();
                    var text = self.app.exporter.getText();

                    self.newFile(dirEntry, jsonFile, function (fileEntry) {
                        self.writeJSONToAFile(fileEntry, json);
                        self.newFile(dirEntry, textFile, function (fileEntry) {
                            self.writeTextToAFile(fileEntry, text);
                            this.fileSystem.set({
                                update: !this.fileSystem.get('update')
                            });
                        });
                    });
                });
            }, self.errorHandler.bind(self));
        };

        FilesView.prototype.writeJSONToAFile = function (fileEntry, content) {

            if (fileEntry.isDirectory) return;
            var self = this;

            self.fileSystem.get('fs').root.getFile(fileEntry.fullPath, {
                create: true
            }, function (fileEntry) {
                // Create a FileWriter object for our FileEntry.
                fileEntry.createWriter(function (fileWriter) {

                    fileWriter.onwriteend = function () {
                        window.console.log('Write completed.');
                    };

                    fileWriter.onerror = function (e) {
                        window.console.log('Write failed: ' + e.toString());
                    };

                    // Create a new Blob and write it to the file.
                    //
                    var blob = new Blob([content], {
                        type: 'application/json'
                    });
                    fileWriter.write(blob);

                }, self.errorHandler.bind(this));
            }, self.errorHandler.bind(this));
        };

        FilesView.prototype.writeTextToAFile = function (fileEntry, content) {
            if (fileEntry.isDirectory) return;
            var self = this;

            self.fileSystem.get('fs').root.getFile(fileEntry.fullPath, {
                create: true
            }, function (fileEntry) {
                // Create a FileWriter object for our FileEntry.
                fileEntry.createWriter(function (fileWriter) {

                    fileWriter.onwriteend = function () {
                        window.console.log('Write completed.');
                    };

                    fileWriter.onerror = function (e) {
                        window.console.log('Write failed: ' + e.toString());
                    };

                    // Create a new Blob and write it to the file.
                    var blob = new Blob([content], {
                        type: 'text/plain'
                    });
                    fileWriter.write(blob);

                }, self.errorHandler.bind(this));
            }, self.errorHandler.bind(this));
        };

        FilesView.prototype.getTimeStamp = function () {
            var date = new Date();
            var dateStr = date.getUTCMonth() + "-" + date.getUTCDate() + "-";
            dateStr += date.getUTCFullYear() + "-" + date.getHours() + "_";
            dateStr += date.getMinutes() + "_" + date.getSeconds();

            return dateStr;
        };

        FilesView.prototype.errorHandler = function (e) {
            window.console.log('Error: ' + e.name + " " + e.message);
        };

        FilesView.prototype.delFile = function () {
            this.fileSystem.set({
                update: !this.fileSystem.get("update")
            });
        };

        FilesView.prototype.saveFile = function (obj, file) {
            if (file.type === "image/png" || file.type === "image/jpg" || file.type === "image/jpeg" || file.type ===
                "image/gif") {
                var reader = new FileReader();
                reader.onload = this.readImage.bind(this, obj, file);
                reader.readAsDataURL(file);
            }
        };

        FilesView.prototype.readImage = function (obj, file, evt) {
            var self = this;
            var img = new Image();
            $(img).load(function () {
                self.saveToFileTypeDirectory(obj, file, self.base64ToBinary(evt.target.result));
            });
            img.src = evt.target.result;
        };

        FilesView.prototype.saveToFileTypeDirectory = function (obj, file, data) {
            var self = this;
            var dirName = this.app.type;
            var timeStamp = self.getTimeStamp();
            self.fileSystem.get('fs').root.getDirectory("/" + dirName, {}, function (dirEntry) {
                self.checkAndWrite(obj, dirEntry, file, data);
            }, function () {
                self.fileSystem.get('fs').root.getDirectory("/", {}, function (dirEntry) {
                    self.newDir(dirEntry, dirName, function (dirEntry) {
                        self.checkAndWrite(obj, dirEntry, file, data);
                    });
                });
            });

            this.fileSystem.set({
                update: !this.fileSystem.get('update')
            });
        };

        FilesView.prototype.checkAndWrite = function (obj, dirEntry, file, data) {
            var self = this;
            var fullPath = dirEntry.fullPath + "/" + file.name;
            self.fileSystem.get("fs").root.getFile(fullPath, {}, function (
                fileEntry) {
                self.writeToFile(obj, fileEntry, file, data);
            }, function () {
                self.newFile(dirEntry, file.name, function (fileEntry) {
                    self.writeToFile(obj, fileEntry, file, data);
                });
            });
        };

        FilesView.prototype.writeToFile = function (obj, fileEntry, file, content) {
            if (fileEntry.isDirectory) return;
            var self = this;

            self.fileSystem.get('fs').root.getFile(fileEntry.fullPath, {
                create: true
            }, function (fileEntry) {
                // Create a FileWriter object for our FileEntry.
                var filePath = fileEntry.fullPath;
                fileEntry.createWriter(function (fileWriter) {

                    fileWriter.onwriteend = function (e) {
                        window.console.log('Write Completed: ' + e.toString());
                        obj.trigger('write-completed', filePath);
                    };

                    fileWriter.onerror = function (e) {
                        window.console.log('Write failed: ' + e.toString());
                        obj.trigger('write-errored');
                    };

                    // Create a new Blob and write it to the file.
                    //
                    var blob = new Blob([content], {
                        type: file.type
                    });
                    fileWriter.write(blob);

                }, self.errorHandler.bind(this));
            }, self.errorHandler.bind(this));
        };

        return FilesView;
    });