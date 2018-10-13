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
            url: "../../file_system/ejs/files.ejs"
        });

        FilesView.prototype.initialize = function (files, fileSystem, app) {
            this.app = app;
            this.fileSystem = fileSystem;
            this.files = files;

            this.listenTo(this.files, "add", this.render);
            this.listenTo(this.files, "remove", this.delFile);
            this.listenTo(this.files, "saving-event", this.savingEventTriggered);

            this.listenToActionEvents();
            this.savingEventsList = [];
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
                this.fileSystem.update();
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
            self.app.exporter.export();
            var timeStamp = self.getTimeStamp();
			if (this.app.projectName == null) {
				var dirName = this.app.type + "-" + timeStamp;
			}
			else {
				var dirName = this.app.projectName + "-" + timeStamp;
			}
            self.fileSystem.get('fs').root.getDirectory(self.fileSystem.get("path"), {}, function (dirEntry) {
                self.newDir(dirEntry, dirName, function (dirEntry) {
					if (self.app.projectName == null) {
						var jsonFile = self.app.type + "-data-" + timeStamp + ".json";
						var textFile = self.app.type + "-data-" + timeStamp + ".txt";
					}
					else {
						var jsonFile = self.app.projectName + "-data-" + timeStamp + ".json";
						var textFile = self.app.projectName + "-data-" + timeStamp + ".txt";
					}
                    var json = self.app.exporter.getJSON();
                    var text = self.app.exporter.getText();
                    if (self.app.exporter.saveAllImages) {
                        self.app.exporter.saveAllImages(function (node, image) {
                            self.readImageFromFileEntry(dirEntry, image);
                        }, function () {
                            self.newFile(dirEntry, jsonFile, function (fileEntry) {
                                self.writeJSONToAFile(fileEntry, json);
                                self.newFile(dirEntry, textFile, function (fileEntry) {
                                    self.writeTextToAFile(fileEntry, text, dirEntry);
                                    self.fileSystem.update();
                                });
                            });
                        });
                    } else {
                        self.newFile(dirEntry, jsonFile, function (fileEntry) {
                            self.writeJSONToAFile(fileEntry, json, dirEntry);
                            self.newFile(dirEntry, textFile, function (fileEntry) {
                                self.writeTextToAFile(fileEntry, text);
                                self.fileSystem.update();
                            });
                        });
                    }
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

                    if (self.app.exporter.saveAllImages) {
                        self.app.exporter.saveAllImages(function (node, image) {
                            self.readImageFromFileEntry(dirEntry, image);
                        }, function () {
                            self.newFile(dirEntry, jsonFile, function (fileEntry) {
                                self.writeJSONToAFile(fileEntry, json);
                                self.newFile(dirEntry, textFile, function (fileEntry) {
                                    self.writeTextToAFile(fileEntry, text);
                                    self.fileSystem.update();
                                    // self.fileSystem.trigger('Compress', dirEntry);
                                });
                            });
                        });
                    } else {


                        self.newFile(dirEntry, jsonFile, function (fileEntry) {
                            self.writeJSONToAFile(fileEntry, json);
                            self.newFile(dirEntry, textFile, function (fileEntry) {
                                self.writeTextToAFile(fileEntry, text);
                                self.fileSystem.update();
                                // self.fileSystem.trigger('Compress', dirEntry);
                            });
                        });
                    }
                });
            }, self.errorHandler.bind(self));
        };

        FilesView.prototype.readImageFromFileEntry = function (dirEntry, fileEntry) {
            var self = this;
            fileEntry.file(function (file) {
                var reader = new FileReader();
                var ext = fileEntry.name.split('.').pop(-1);

                reader.onload = function (evt) {
                    var file = {
                        name: fileEntry.name,
                        type: ext
                    }
                    var img = new Image();
                    $(img).load(function () {
                        self.checkAndWrite(null, dirEntry, file, self.base64ToBinary(evt.target.result));
                    });
                    img.src = evt.target.result;
                };

                reader.readAsDataURL(file);
            }, self.errorHandler.bind(self));
        };

        FilesView.prototype.writeJSONToAFile = function (fileEntry, content, dirEntry) {

            if (fileEntry.isDirectory) return;
            var self = this;

            self.fileSystem.get('fs').root.getFile(fileEntry.fullPath, {
                create: true
            }, function (fileEntry) {
                // Create a FileWriter object for our FileEntry.
                fileEntry.createWriter(function (fileWriter) {

                    fileWriter.onwriteend = function () {
                        window.console.log('Write completed.');
                        self.files.trigger('saving-event', 'json-file-generated', dirEntry);
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

        FilesView.prototype.writeTextToAFile = function (fileEntry, content, dirEntry) {
            if (fileEntry.isDirectory) return;
            var self = this;

            self.fileSystem.get('fs').root.getFile(fileEntry.fullPath, {
                create: true
            }, function (fileEntry) {
                // Create a FileWriter object for our FileEntry.
                fileEntry.createWriter(function (fileWriter) {

                    fileWriter.onwriteend = function () {
                        self.files.trigger('saving-event', 'text-file-generated', dirEntry);
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
			var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            var dateStr = date.getUTCDate() + "" + monthNames[date.getUTCMonth()]  + "";
            dateStr += date.getUTCFullYear() + "_" + date.getHours() + "_";
            dateStr += date.getMinutes() + "_" + date.getSeconds();

            return dateStr;
        };

        FilesView.prototype.errorHandler = function (e) {
            window.console.log('Error: ' + e.name + " " + e.message);
            this.fileSystem.trigger('error', 'Something went wrong while saving the project.');
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
                self.saveToFileTypeDirectory(obj, file, evt.target.result);
            });
            img.src = evt.target.result;
        };

        FilesView.prototype.saveToFileTypeDirectory = function (obj, file, data) {
            var self = this;
            data = self.base64ToBinary(data);
            var dirName = this.app.type;
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
            self.fileSystem.get("fs").root.getFile(fullPath, {}, function (fileEntry) {
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
                        if (obj) {
                            obj.trigger('write-completed', fileEntry);
                        }
                    };

                    fileWriter.onerror = function (e) {
                        window.console.log('Write failed: ' + e.toString());
                        if (obj) {
                            obj.trigger('write-errored');
                        }
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

        FilesView.prototype.savingEventTriggered = function(eventType, dirEntry) {
            if (_.indexOf(this.savingEventsList, eventType) === -1) {
                this.savingEventsList.push(eventType)
            }
            if (_.difference(this.savingEventsList, ["json-file-generated", "text-file-generated"]).length === 0) {
                this.savingEventsList = [];
                this.fileSystem.trigger('Compress', dirEntry);
            }
        };

        return FilesView;
    });
