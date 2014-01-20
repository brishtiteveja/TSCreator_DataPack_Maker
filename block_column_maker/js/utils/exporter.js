/*================================================================
=            Exporter - Data Exporter for block maker            =
================================================================*/

define([], function() {

	var Exporter = function(app) {
		this.app = app;
	}

	Exporter.prototype.initialize = function() {
		this.markers = this.app.MarkersCollection;
		this.blockColumns = this.app.BlockColumnsCollection;
	}

	Exporter.prototype.export = function() {
		this.initialize();
	}

	Exporter.prototype.getText = function() {
		var self = this;
		var outputText = this.getMetaColumnData();
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

		blockColumn.get('blocks').each(function(block) {
			outputText += self.getBlockData(block);
		});

		return outputText;
	}

	Exporter.prototype.getBlockData = function(block) {
		var outputText = "\n";
		outputText += "\t" + block.get('name');
		outputText += "\t" + (block.get('base').get('age') || "n/a") ;
		outputText += "\t" + block.get('base').get('style');
		outputText += "\t" + (block.get('description') || "");

		return outputText;
	}

	return Exporter;
});

/*-----  End of Exporter - Data Exporter for block maker  ------*/

