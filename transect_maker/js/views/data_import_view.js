/*======================================
=            DataImportView            =
======================================*/

define(["baseView"], function(BaseView) {
	var DataImportView = BaseView.extend({
		el: ".container",
		classname: "DataImportView",
		events: {
			"dragover #image-box": "imageDragover",
			"drop #image-box": "imageDrop",
		}
	});

	DataImportView.prototype.initialize = function() {
		this.addedImage = false;
		this.addedData = false;
		this.$imageStatus = this.$(".image-status");
		this.$dataStatus = this.$(".data-status");
		this.$noImageOrData = this.$("#no-image-or-data");
		this.$noData = this.$("#no-data");
		this.$noImage = this.$("#no-image");
		this.$continueBoth = this.$("#continue-both");
		this.$continueLink = this.$(".continue-to-main");
	}

	DataImportView.prototype.imageDragover = function(evt) {
		var evt = evt.originalEvent;
		evt.stopPropagation();
    	evt.preventDefault();
    	evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
	}

	DataImportView.prototype.imageDrop = function(evt) {
		var evt = evt.originalEvent;
		evt.stopPropagation();
    	evt.preventDefault();
    	var file = evt.dataTransfer.files[0];
    	
    	if (file.type === "image/png"
    		|| file.type === "image/jpg"
    		|| file.type === "image/jpeg"
    		|| file.type === "image/gif") {
	    	var reader = new FileReader();
	    	reader.onload = this.readImage.bind(this);
	    	reader.readAsDataURL(file);	
    	}
	}

	DataImportView.prototype.readImage = function(evt) {
		var self = this;
		var img = new Image();
		$(img).load(function() {
			transectApp.TransectImage.set({
				"data": evt.target.result,
				"width": img.width,
				"height": img.height,
			});
			self.addedImage = true;
			self.continueToMain();
		});
		img.src = evt.target.result;
	}

	DataImportView.prototype.continueToMain = function() {

		if (this.addedImage) {
			this.$imageStatus.html("Image loaded successfully");
		}
		if (this.addedData) {
			this.$dataStatus.html("Data loaded successfully");
		}

		this.$continueLink.addClass("hide");
		
		if (this.addedImage && this.addedData){
			this.$continueBoth.removeClass("hide");
		}
		else if (this.addedImage) {
			this.$noData.removeClass("hide");
		}
		else if (this.addedData) {
			this.$noImage.removeClass("hide");
		}
		else {
			this.$noImageOrData.removeClass("hide");
		}
	}

	return DataImportView
});

/*-----  End of DataImportView  ------*/