define([], function() {

	var Exporter = function(app) {
		this.app = app;
	}

	Exporter.prototype.initialize = function() {
		this.imageOb = this.app.ImageOb;
		this.markers = this.app.MarkersCollection;
		this.zones = this.app.ZonesCollection;
		this.lithologyColumns = this.app.LithologyColumnsCollection;
	}

	Exporter.prototype.export = function() {
		this.initialize();
        this.lithologyColumns.updateZones();
	}

	Exporter.prototype.getText = function() {
		var self = this;
		var outputText = "\n\n";
		outputText += self.getMetaColumnData();
		this.lithologyColumns.each(function(lithologyColumn) {
			outputText += self.getLithologyColumnData(lithologyColumn);
		});

		return outputText;
	}

	Exporter.prototype.getMetaColumnData = function() {
		if (this.app.projectName != null) {
			var outputText = this.app.projectName + "\t:";
		} 
		else {
			var outputText = "Lithologies\t:";
		}
		this.lithologyColumns.each(function(lithologyColumn) {
			outputText += "\t" + lithologyColumn.get('name');
		});

		return outputText;
	}

	Exporter.prototype.getLithologyColumnData = function(lithologyColumn) {
		var self = this;
		var outputText = "\n\n" + lithologyColumn.get('name');
		outputText += "\tfacies";
		outputText += "\t" + lithologyColumn.get('width');
		outputText += "\t" + CssToTscColor(lithologyColumn.get('settings').get('backgroundColor'));
		outputText += "\t";
		//outputText += "\tnotitle";
		outputText += "\t";
		var lithColDesc = lithologyColumn.get('description'); 
		outputText += "\t" + ((lithColDesc != null)? lithColDesc + "\t" : "");

		lithologyColumn.get('lithologyGroups').each(function(lithologyGroup) {
			outputText += self.getLithologyGroupData(lithologyGroup);
		});

		return outputText;
	}

	Exporter.prototype.getLithologyGroupData = function(lithologyGroup) {
		var self = this;
		var outputText = "\n" + lithologyGroup.get("name");
		outputText += "\tPrimary";
		outputText += "\t";
		outputText += "\t\t" + (lithologyGroup.get('description') + "\t" || "");

		lithologyGroup.get('lithologys').each(function(lithology) {
			outputText += self.getLithologyData(lithology, lithologyGroup);
		});

		return outputText;
	}

	Exporter.prototype.getLithologyData = function(lithology, lithologyGroup) {
		var outputText = "\n";


		if (lithology.get('top').get('lithologys').length < 2) {
			var lithAge = parseFloat(Math.round(lithology.get('top').get('age') * 1000) / 1000).toFixed(3);
			outputText += "\tTOP";
			outputText += "\t";
			outputText += "\t" + (lithAge || "0.000");
			var lithDesc = lithology.get('description');
			outputText += "\t" + ((lithDesc != null)? (lithDesc + " ") : "") + "<br>CALIBRATION = " + (Math.round((1 - lithology.get("top").get("relativeY")) * 1000) * 1.0 / 10.0) + "% up the " + lithology.get("top").get("zone").get('name');
			outputText += "\n";
		}

		outputText += "\t" + (lithology.getPatternName() || "None");
        var lithName = lithology.get('name'); 
        // Check whether common formation name is provided
        if(lithName == null || (lithName != null && lithName.includes('Formation'))) {
            lithName = lithologyGroup.get('lithologysCommonName'); 
        }
		var name = (lithName != null)? (lithName+ " ") : "";  
		outputText += "\t" + name;

		var lithAge = parseFloat(Math.round(lithology.get('base').get('age') * 1000) / 1000).toFixed(3);
		outputText += "\t" + (lithAge || "0.000");

		var lithDesc = lithology.get('description');
        // Check whether common formation description is provided
        if(lithDesc == null) {
            lithDesc = lithologyGroup.get('lithologysCommonDescription'); 
        }
		var description = (lithDesc != null)? (lithDesc+ " ") : "";  
		var description = description
								+ "<br>CALIBRATION = " 
								+ (Math.round((1 - lithology.get("base").get("relativeY")) * 1000) * 1.0 / 10.0) 
								+ "% up the " + lithology.get("base").get("zone").get('name');
		outputText += "\t" + description; 
		outputText += "\t" + (lithology.get('memberName') || "");

		var lineStyle = lithology.get('base').get('style');
		var lineStyleInfo = (lineStyle === "solid" || lineStyle == null) ? "" : lineStyle; 
		outputText += "\t" + lineStyleInfo; 

		return outputText;
	}

	Exporter.prototype.getJSON = function() {
		var json = {};
		json["projectName"] = this.app.projectName;
		json["image"] = this.imageOb.toJSON();
		json["zones"] = this.zones.toJSON();
		json["lithologyColumns"] = this.lithologyColumns.toJSON();
		json["referenceColumn"] = this.app.referenceColumn.toJSON();
		if (this.app.lithology2dApp) {
			json["lithology2dApp"] = {
				"polygons": this.app.lithology2dApp.PolygonsCollection.toJSON()
			}
		}

		return JSON.stringify(json);
	}

	return Exporter;
});
