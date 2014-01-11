
/*========================================
=            BlockColumnView            =
========================================*/

define(["baseView", "blockView", "block"], function(BaseView, BlockView, Block) {

	var BlockColumnView = BaseView.extend({
		tagName: "li",
		classname: "BlockColumnView",
		events: {
			'click .toggle': 'toggleBlockColumnForm',
			'click .block-column-data': 'toggleBlockColumnForm',
			'click .destroy': 'destroy',
			'keypress :input': 'updateBlockColumn',
			'keyup :input': 'updateBlockColumn',
			'change input[name="block-column-bg-color"]': 'updateBlockColumn',
			'mouseover': "onMouseOver",
			'mouseout': "onMouseOut",
		}
	});

	BlockColumnView.prototype.template = new EJS({url: '/block_column_maker/ejs/block_column.ejs'});

	BlockColumnView.prototype.initialize = function(app, blockColumn) {	
		this.app = app;
		this.blockColumn = blockColumn;

		this.render();

		this.listenTo(this.blockColumn, 'change:edit', this.editBlockColumn.bind(this));
		this.listenTo(this.blockColumn, 'change', this.renderBlockColumn.bind(this));
		this.listenTo(this.blockColumn.get('settings'), 'change', this.renderBlockColumn.bind(this));
		this.listenTo(this.blockColumn.get('blocks'), 'add', this.addBlock.bind(this));
		// this.listenTo(this.blockColumn, 'change:hover', this.setHoverStatus.bind(this));
		this.listenTo(this.blockColumn, 'destroy', this.delete.bind(this));
	};

	BlockColumnView.prototype.render = function() {
		this.$el.html(this.template.render(this.blockColumn.toJSON()));

		/* get DOM elements after render */
		this.$toggle = this.$(".toggle");
		this.$blockColumnForm = this.$(".block-column-form");
		this.$blockColumnData = this.$(".block-column-data");
		this.$blockColumnName = this.$('input[name="block-column-name"]')[0];
		this.$blockColumnWidth = this.$('input[name="block-column-width"]')[0];
		this.$blockColumnBgColor = this.$('input[name="block-column-bg-color"]')[0];
		this.$blockColumnDescription = this.$('textarea[name="block-column-description"]')[0];

		this.renderBlockColumn();
	}

	BlockColumnView.prototype.renderBlockColumn = function() {
		if (this.element === undefined) {
			this.element = this.app.Canvas.rect(this.blockColumn.get('x'), 0, this.blockColumn.get('width'), this.app.Canvas.height);

			/* attach listeners to the element */
			this.element.dblclick(this.createBlock.bind(this));
		}

		this.element.attr({
			x: this.blockColumn.get('x'),
			width: this.blockColumn.get('width'),
			fill: this.blockColumn.get('settings').get('backgroundColor')
		});

		this.updateBlockColumns();
	}

	BlockColumnView.prototype.toggleBlockColumnForm = function() {
		this.render();
		this.blockColumn.set({
			'edit': !this.blockColumn.get('edit')
		});
	}

	BlockColumnView.prototype.editBlockColumn = function() {
		if (this.blockColumn.get('edit')) {
			this.$blockColumnForm.removeClass('hide');
			this.$blockColumnData.addClass('hide');
			this.$toggle.removeClass('hide-data');
			this.$toggle.addClass('show-data');
		} else {
			this.$blockColumnForm.addClass('hide');
			this.$blockColumnData.removeClass('hide');
			this.$toggle.removeClass('show-data');
			this.$toggle.addClass('hide-data');
		}
	};

	BlockColumnView.prototype.delete = function() {
		if (this.element !== undefined) this.element.remove();
		this.$el.remove();
		this.remove();
	}


	BlockColumnView.prototype.updateBlockColumn = function(evt) {
		
		if (evt.keyCode == 13) {
			this.toggleBlockColumnForm();
		}

		var name = this.$blockColumnName.value;
		var description = this.$blockColumnDescription.value;
		var width = this.$blockColumnWidth.value;
		var bgColor = this.$blockColumnBgColor.value;
		
		this.blockColumn.set({
			name: name,
			description: description,
			width: parseInt(width) || 0,
		});
		
		this.blockColumn.get('settings').set({
			backgroundColor: bgColor
		});
	};

	BlockColumnView.prototype.createBlock = function(evt) {
		var block = new Block({y: evt.offsetY, blockColumn: this.blockColumn});
		this.blockColumn.get('blocks').add(block);
	}

	BlockColumnView.prototype.addBlock = function(block) {
		var blockView = new BlockView(this.app, block);

	}

	BlockColumnView.prototype.updateBlockColumns = function() {
		// var self = this;
		// var stratIndex = this.app.BlockColumnsCollection.indexOf(this.blockColumn);
		// this.app.BlockColumnsCollection.each(function(blockColumn, index) {
		// 	if (index > stratIndex) {
		// 		debugger;
		// 		var prevColumn = self.app.BlockColumnsCollection.at(index - 1);
		// 		var x = prevColumn.get('x') + prevColumn.get('width');
		// 		blockColumn.set({
		// 			x: x
		// 		});
		// 	}
		// });
	}

	return BlockColumnView;
});

/*-----  End of BlockColumnView  ------*/
