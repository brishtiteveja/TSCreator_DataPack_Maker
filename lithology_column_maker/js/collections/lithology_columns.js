/*================================================
=            Lithology Columns collection            =
================================================*/

define(["baseCollection", "lithologyColumn"], function(BaseCollection, LithologyColumn) {

	var LithologyColumns = BaseCollection.extend({
		classname: "LithologyColumns",
		model: LithologyColumn,
	});

    LithologyColumns.prototype.updateZones = function() {
        this.each(function (column) {
            column.updateZones();
        });
    };

	return LithologyColumns;
});

/*-----  End of Lithology Columns collection  ------*/

