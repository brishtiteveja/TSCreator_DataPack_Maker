
/*========================================
=            BlockColumnView            =
========================================*/

define(["baseView", "blockView", "blockMarkerView", "block", "blockMarker"], function(BaseView, BlockView, BlockMarkerView, Block, BlockMarker) {

	var BlockColumnView = BaseView.extend({
		tagName: "li",
		classname: "BlockColumnView",
		events: {
			'click .toggle': 'toggleBlockColumnForm',
			'click .block-column-data': 'toggleBlockColumnForm',
			'click .destroy': 'destroy',
			'click label.block-column-blocks-data': 'showBlocksList',
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
		this.listenTo(this.blockColumn.get('blockMarkers'), 'add', this.addBlockMarker.bind(this));
		this.listenTo(this.blockColumn.get('blocks'), 'remove', this.removeBlock.bind(this));
		this.listenTo(this.blockColumn.get('blocks'), 'add', this.addBlock.bind(this));
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
		this.$blocksList = this.$('.blocks-list');

		this.renderBlockColumn();
		// this.renderBlocks();
	}

	BlockColumnView.prototype.renderBlockColumn = function() {
		if (this.element === undefined) {
			this.element = this.app.Canvas.rect(this.blockColumn.get('x'), 0, this.blockColumn.get('width'), this.app.Canvas.height);

			/* attach listeners to the element */
			this.element.dblclick(this.createBlockMarker.bind(this));

			this.app.MarkersSet.toFront();
		}

		this.element.attr({
			x: this.blockColumn.get('x'),
			width: this.blockColumn.get('width'),
			fill: this.blockColumn.get('settings').get('backgroundColor')
		});

		this.updateBlockColumns();
	}

	BlockColumnView.prototype.resetBlocks = function() {
		this.$blocksList.html('');
		this.blockColumn.get('blocks').each(this.addBlock.bind(this));
	}

	BlockColumnView.prototype.renderBlocks = function() {
		this.blockColumn.get('blocks').each(this.addBlockMarker.bind(this));
	}

	BlockColumnView.prototype.toggleBlockColumnForm = function() {
		this.renderBlockColumn();
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

	BlockColumnView.prototype.createBlockMarker = function(evt) {
		if (!this.app.enBlocks) return;
		var blockMarker = new BlockMarker({y: evt.offsetY, blockColumn: this.blockColumn}, this.app);

		if (blockMarker.get('zone') === null) {
			blockMarker.destroy();
			return;
		}
		
		this.blockColumn.get('blockMarkers').add(blockMarker);
	}

	BlockColumnView.prototype.addBlockMarker = function(blockMarker) {
		var blockMarkerView = new BlockMarkerView(this.app, blockMarker);

		var self = this;
		var blocks = this.blockColumn.get('blocks');
		var blockMarkers = this.blockColumn.get('blockMarkers');

		blockMarkers.sort();

		var index = blockMarkers.indexOf(blockMarker);

		var topMarker, baseMarker;

		if (blockMarkers.length > 1) {
			
			if (index == 0) {
				topMarker = blockMarkers.at(index);
				baseMarker = blockMarkers.at(index + 1);
			} else {
				topMarker = blockMarkers.at(index - 1);
				baseMarker = blockMarkers.at(index);
			}
			
			var block = blocks.findWhere({top: topMarker, base: baseMarker}) ||
						new Block({top: topMarker, base: baseMarker, blockColumn: self.blockColumn});
			topMarker.get('blocks').add(block);
			baseMarker.get('blocks').add(block);
			baseMarker.set({
				name: block.get('name') + " Base"
			});
			blocks.add(block);
		}
	}

	BlockColumnView.prototype.removeBlock = function(block) {
		var topMarker = block.get('top');
		var baseMarker = block.get('top');
	}

	BlockColumnView.prototype.addBlock = function(block) {
		var blockView = new BlockView(this.app, block);
		this.$blocksList.append(blockView.el);
	}

	BlockColumnView.prototype.updateBlockColumns = function() {
		var self = this;
		var stratIndex = this.app.BlockColumnsCollection.indexOf(this.blockColumn);
		this.app.BlockColumnsCollection.each(function(blockColumn, index) {
			if (index > stratIndex) {
				var prevColumn = self.app.BlockColumnsCollection.at(index - 1);
				var x = prevColumn.get('x') + prevColumn.get('width');
				blockColumn.set({
					x: x
				});
			}
		});
	}

	BlockColumnView.prototype.showBlocksList = function() {
		if (this.$blocksList.hasClass('hide')) {
			this.$blocksList.removeClass('hide');
		} else {
			this.$blocksList.addClass('hide');
		}
	}

	BlockColumnView.prototype.delete = function() {
		_.invoke(this.blockColumn.get('blocks').toArray(), "destroy");
		if (this.element) this.element.remove();
		this.$el.remove();
		this.remove();
	}

	BlockColumnView.prototype.destroy = function() {
		this.blockColumn.destroy();
	}

	return BlockColumnView;
});

/*-----  End of BlockColumnView  ------*/
