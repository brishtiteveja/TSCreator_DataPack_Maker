/*================================================================
=            Exporter - Data Exporter for lithology maker            =
================================================================*/

define([], function() {

	var Exporter = function(app) {
		this.app = app;
	}

	Exporter.prototype.initialize = function() {
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
		this.lithologyColumns.each(function(lithologyColumn) {
			outputText += self.getLithologyColumnData(lithologyColumn);
		});

		return outputText;
	}

	Exporter.prototype.getMetaColumnData = function () {
		var outputText = "Lithologys:";
		this.lithologyColumns.each(function(lithologyColumn) {
			outputText += "\t" + lithologyColumn.get('name');
		});

		return outputText;
	}

	Exporter.prototype.getLithologyColumnData = function(lithologyColumn) {
		var self = this;
		var outputText = "\n\n" + lithologyColumn.get('name');
		outputText += "\tlithology";
		outputText += "\t" + lithologyColumn.get('width');
		outputText += "\tUSGS-Named";
		outputText += "\t" + (lithologyColumn.get('description') || "");

		lithologyColumn.get('lithologys').each(function(lithology, index) {
			outputText += self.getLithologyData(lithology);
		});

		return outputText;
	}

	Exporter.prototype.getLithologyData = function(lithology) {
		var outputText = "\n";

		var top = lithology.get("top");
		if (top.get('lithologys').length < 2) {
			outputText += "\t" + top.get('name');
			outputText += "\t" + (top.get('age') || "n/a") ;
			outputText += "\n";
		}

		outputText += "\t" + lithology.get('name');
		outputText += "\t" + (lithology.get('base').get('age') || "n/a") ;
		outputText += "\t" + lithology.get('base').get('style');
		outputText += "\t" + (lithology.get('description') || "");
		outputText += "\t" + CssToTscColor(lithology.get('settings').get('backgroundColor'));

		return outputText;
	}

	Exporter.prototype.getJSON = function() {
		var json = {};
		json["zones"] = this.zones.toJSON();
		json["lithologyColumns"] = this.lithologyColumns.toJSON();
		return JSON.stringify(json);
	}

	return Exporter;
});

/*-----  End of Exporter - Data Exporter for lithology maker  ------*/

