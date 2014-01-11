/*========================================
=            BlockColumnsView            =
========================================*/

define(["baseView", "blockColumnView", "blockColumn"], function(BaseView, BlockColumnView, BlockColumn) {
	
	var BlockColumnsView = BaseView.extend({
		el: "#columns-list",
		classname: "BlockColumns",
	});


	BlockColumnsView.prototype.template = new EJS({url: '/commons/ejs/data_tbl.ejs'});

	BlockColumnsView.prototype.initialize = function(app) {
		this.app = app;
		this.blockColumns = this.app.BlockColumnsCollection;


		this.listenTo(this.blockColumns, "add", this.addBlockColumn.bind(this));
		this.listenToActionEvents();

		this.render();
	}

	BlockColumnsView.prototype.listenToActionEvents = function() {
		$('a[href="#new-column"').bind('click', this.createBlockColumn.bind(this));
	}

	BlockColumnsView.prototype.render = function() {
		this.$el.html(this.template.render());
		this.$columnsList = this.$(".data-list");
	}

	BlockColumnsView.prototype.addBlockColumn = function(blockColumn) {
		var blockColumnView = new BlockColumnView(this.app, blockColumn);
		this.$columnsList.append(blockColumnView.el);
	}

	BlockColumnsView.prototype.createBlockColumn = function() {
		var x = 0;
		if (this.blockColumns.length > 0) {
			x = this.blockColumns.last().get('x') + this.blockColumns.last().get('width');
		}
		var name = "Column " + this.blockColumns.length;
		this.blockColumns.add(new BlockColumn({x: x, name: name}));
	}

	return BlockColumnsView;
});


/*-----  End of BlockColumnsView  ------*/

