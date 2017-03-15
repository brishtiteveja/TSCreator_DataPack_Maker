define(["baseView"], function (BaseView) {

    var FileView = BaseView.extend({
        tagName: 'div',
        classname: "FileView",
        events: {
            'dblclick': 'open',
            'click': 'select',
            'blur .file-name': 'blur',
        }
    });

    FileView.prototype.template = new EJS({
        url: "../../file_system/ejs/file.ejs"
    });

    FileView.prototype.initialize = function (file, files, fileSystem, app) {
        this.app = app;
        this.fileSystem = fileSystem;
        this.files = files;
        this.file = file;

        this.listenTo(this.file, "change:selected", this.setSelected.bind(this));
        this.listenTo(this.file, "change:name", this.rename.bind(this));
        this.listenTo(this.file, "destroy", this.delete.bind(this));
        this.listenToActionEvents();

        this.render();
    };

    FileView.prototype.listenToActionEvents = function () {
        // $('a[href="#compress-file"]').click(this.compress.bind(this));
        $('a[href="#delete-file"]').click(this.deleteFile.bind(this));
        $('a[href="#load-data"]').click(this.loadData.bind(this));
    };

    FileView.prototype.render = function () {
        var json = this.file.toJSON();
        this.$el.html(this.template.render(json));
        this.$file = this.$(".file");
        this.$fileName = this.$(".file-name")[0];
    };

    FileView.prototype.deleteFile = function () {
        var self = this;
        if (!self.file.get('selected')) return;
        if (self.file.get("isFile")) {
            self.fileSystem.get('fs').root.getFile(self.file.get("fullPath"), {}, function (fileEntry) {
                fileEntry.remove(function () {
                    window.console.log('File removed.');
                    self.file.destroy();
                    self.fileSystem.update();
                }, self.errorHandler.bind(this));
            }, self.errorHandler.bind(this));
        } else {
            self.fileSystem.get('fs').root.getDirectory(self.file.get('fullPath'), {}, function (dirEntry) {
                dirEntry.removeRecursively(function () {
                    window.console.log('Directory removed.');
                    self.file.destroy();
                    self.fileSystem.update();
                }, self.errorHandler.bind(this));
            }, self.errorHandler.bind(this));
        }
    };

    FileView.prototype.select = function () {
        var self = this;
        this.files.each(function (file) {
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
    };

    FileView.prototype.setSelected = function () {
        if (this.file.get('selected')) {
            this.$file.addClass("active");
        } else {
            this.$file.removeClass("active");
        }
    };


    FileView.prototype.blur = function () {
        this.file.set({
            name: this.$fileName.textContent
        });
    };

    FileView.prototype.rename = function () {
        var self = this;
        if (self.file.get("isFile")) {
            self.fileSystem.get('fs').root.getFile(self.file.get("fullPath"), {}, function (fileEntry) {
                var path = self.file.get("fullPath").split("/");
                path.pop();
                path = path.join("/");
                if (path === "") {
                    path = "/";
                }
                self.fileSystem.get('fs').root.getDirectory(path, {}, function (dirEntry) {
                    fileEntry.moveTo(dirEntry, self.file.get("name"));
                    self.file.destroy();
                    self.fileSystem.update();

                }, self.errorHandler.bind(this));
            }, self.errorHandler.bind(this));
        } else {
            self.fileSystem.get('fs').root.getDirectory(self.file.get("fullPath"), {}, function (fileEntry) {
                var path = self.file.get("fullPath").split("/");
                path.pop();
                path = path.join("/");
                if (path === "") {
                    path = "/";
                }
                self.fileSystem.get('fs').root.getDirectory(path, {}, function (dirEntry) {
                    fileEntry.moveTo(dirEntry, self.file.get("name"));
                    self.file.destroy();
                    self.fileSystem.update();
                }, self.errorHandler.bind(this));
            }, self.errorHandler.bind(this));
        }
    };

    FileView.prototype.open = function () {
        var self = this;
        if (self.file.get('isFile')) {

        } else {
            this.fileSystem.set({
                path: this.file.get('fullPath')
            });
            self.fileSystem.update();
        }
    };

    FileView.prototype.errorHandler = function (e) {
        window.console.log('Error: ' + e.name + " " + e.message);
    };

    FileView.prototype.loadData = function () {
        var self = this;
        if (self.file.get('isDirectory') || !self.file.get("selected")) return;

        self.fileSystem.get("fs").root.getFile(self.file.get('fullPath'), {}, function (fileEntry) {

            // Get a File object representing the file,
            // then use FileReader to read its contents.
            fileEntry.file(function (file) {
                var reader = new FileReader();

                reader.onloadend = function () {
                    self.showCanvas();
                    self.app.loader.loadData(this.result);
                };

                reader.readAsText(file);
            }, self.errorHandler.bind(self));

        }, self.errorHandler.bind(self));
    };

    FileView.prototype.showCanvas = function () {
        $("#canvas").removeClass('hide');
        $("#file-system-panel").addClass('hide');
        $("a[href='#file-system']").parent().removeClass('active');
    };

    FileView.prototype.delete = function () {
        this.$el.remove();
        this.remove();
    };

    return FileView;
});
