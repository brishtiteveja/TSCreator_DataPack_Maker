/*================================================================
=            Exporter - Data Exporter for lithology maker            =
================================================================*/

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
		var outputText = "Lithologys\t:";
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
		outputText += "\tnotitle";
		outputText += "\t";
		outputText += "\t" + (lithologyColumn.get('description') || "");

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
		outputText += "\t" + (lithologyGroup.get('description') || "");

		lithologyGroup.get('lithologys').each(function(lithology) {
			outputText += self.getLithologyData(lithology);
		});

		return outputText;
	}

	Exporter.prototype.getLithologyData = function(lithology) {
		var outputText = "\n";

		if (lithology.get('top').get('lithologys').length < 2) {
			outputText += "\tTOP";
			outputText += "\t";
			outputText += "\t" + (lithology.get("top").get("age") || "n/a");
			outputText += "\t" + (lithology.get('description') || "") + "CALIBRATION = " + (Math.round((1 - lithology.get("top").get("relativeY")) * 1000) * 1.0 / 10.0) + "% up the " + lithology.get("top").get("zone").get('name');
			outputText += "\n";
		}

		outputText += "\t" + (lithology.getPatternName() || "");
		outputText += "\t" + lithology.get('name');
		outputText += "\t" + (lithology.get('base').get('age') || "n/a");
		outputText += "\t" + (lithology.get('description') || "") + "CALIBRATION = " + (Math.round((1 - lithology.get("base").get("relativeY")) * 1000) * 1.0 / 10.0) + "% up the " + lithology.get("base").get("zone").get('name');

		return outputText;
	}

	Exporter.prototype.getJSON = function() {
		var json = {};
		json["image"] = this.imageOb.toJSON();
		json["zones"] = this.zones.toJSON();
		json["lithologyColumns"] = this.lithologyColumns.toJSON();
		json["referenceColumn"] = this.app.referenceColumn.toJSON();

		return JSON.stringify(json);
	}

	return Exporter;
});

/*-----  End of Exporter - Data Exporter for lithology maker  ------*/