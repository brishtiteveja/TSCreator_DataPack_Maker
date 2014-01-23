/*================================================================
=            Exporter - Data Exporter for block maker            =
================================================================*/

define([], function() {

	var Exporter = function(app) {
		this.app = app;
	}

	Exporter.prototype.initialize = function() {
		this.markers = this.app.MarkersCollection;
		this.zones = this.app.ZonesCollection;
		this.blockColumns = this.app.BlockColumnsCollection;
	}

	Exporter.prototype.export = function() {
		this.initialize();
	}

	Exporter.prototype.getText = function() {
		var self = this;
		var outputText = "\n\n";
		this.blockColumns.each(function(blockColumn) {
			outputText += self.getBlockColumnData(blockColumn);
		});

		return outputText;
	}

	Exporter.prototype.getMetaColumnData = function () {
		var outputText = "Blocks:";
		this.blockColumns.each(function(blockColumn) {
			outputText += "\t" + blockColumn.get('name');
		});

		return outputText;
	}

	Exporter.prototype.getBlockColumnData = function(blockColumn) {
		var self = this;
		var outputText = "\n\n" + blockColumn.get('name');
		outputText += "\tblock";
		outputText += "\t" + blockColumn.get('width');
		outputText += "\tUSGS-Named";
		outputText += "\t" + (blockColumn.get('description') || "");

		blockColumn.get('blocks').each(function(block, index) {
			outputText += self.getBlockData(block);
		});

		return outputText;
	}

	Exporter.prototype.getBlockData = function(block) {
		var outputText = "\n";

		var top = block.get("top");
		if (top.get('blocks').length < 2) {
			outputText += "\t" + top.get('name');
			outputText += "\t" + (top.get('age') || "n/a") ;
			outputText += "\n";
		}

		outputText += "\t" + block.get('name');
		outputText += "\t" + (block.get('base').get('age') || "n/a") ;
		outputText += "\t" + block.get('base').get('style');
		outputText += "\t" + (block.get('description') || "");
		outputText += "\t" + CssToTscColor(block.get('settings').get('backgroundColor'));

		return outputText;
	}

	Exporter.prototype.getJSON = function() {
		var json = {};
		json["zones"] = this.zones.toJSON();
		json["blockColumns"] = this.blockColumns.toJSON();
		return JSON.stringify(json);
	}

	return Exporter;
});

/*-----  End of Exporter - Data Exporter for block maker  ------*/

