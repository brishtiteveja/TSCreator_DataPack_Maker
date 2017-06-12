
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

	BlockColumnView.prototype.template = new EJS({url: '../../block_column_maker/ejs/block_column.ejs'});

	BlockColumnView.prototype.initialize = function(app, blockColumn) {	
		this.app = app;
		this.blockColumn = blockColumn;
        this.blockColumn.blockColumnView = this;

		this.render();

		this.listenTo(this.blockColumn, 'change:edit', this.editBlockColumn.bind(this));
		this.listenTo(this.blockColumn, 'change:hover', this.setHoverStatus.bind(this));
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
			this.element = this.app.Paper.rect(this.blockColumn.get('x'), 0, this.blockColumn.get('width'), this.app.Paper.height);

			/* attach listeners to the element */
			this.element.dblclick(this.createBlockMarker.bind(this));
            this.element.hover(this.onMouseOver.bind(this), this.onMouseOut.bind(this));
			this.element.drag(this.dragMove.bind(this), this.dragStart.bind(this), this.dragEnd.bind(this));

			this.app.MarkersSet.toFront();
		}

		this.element.attr({
			x: this.blockColumn.get('x'),
			width: this.blockColumn.get('width'),
			fill: this.blockColumn.get('settings').get('backgroundColor'),
            opacity: 0.4,
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
		var baseMarker = block.get('base');
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

	BlockColumnView.prototype.onMouseOver = function() {
		this.$el.addClass('hover');
		this.blockColumn.set({
			hover: true,
		});
    }

	BlockColumnView.prototype.onMouseOut = function() {
		this.$el.removeClass('hover');
		this.blockColumn.set({
			hover: false,
		});
    }

	BlockColumnView.prototype.setHoverStatus = function() {
		if (this.blockColumn.get('hover')) {
			this.$el.addClass('hover');
			this.glow  = this.element.glow();
		} else {
			if (this.glow) this.glow.remove();
			this.$el.removeClass('hover');
		}
	}

	/*==========  start dragging  ==========*/
	BlockColumnView.prototype.dragStart = function(x, y, evt) {
		var self = this;
		this.blockColumnIndex = this.app.BlockColumnsCollection.indexOf(this.blockColumn);
        this.blockColumnX = this.app.BlockColumnsCollection.at(this.blockColumnIndex).get('x');
        this.curBlockColumnWidth = this.blockColumn.get('width');

        var startIndex = this.blockColumnIndex;
        if (Math.abs(this.blockColumnX - x) <= 100) {
		    this.app.BlockColumnsCollection.each(function(blockColumn, index) {
                // find the index of previous column
			    if (index == startIndex - 1) {
				    self.prevColumn = self.app.BlockColumnsCollection.at(index);
                    self.prevColumnWidth = self.prevColumn.get('width');  
			        if (self.glow) 
                        self.glow.remove();
			    }
            });
        } 
    };

	/*==========  while dragging  ==========*/
	BlockColumnView.prototype.dragMove = function(dx, dy, x, y, evt) {
        if (this.prevColumn) {
            // changing the width of the previous column which will automatically shift all other columns
            this.newWidthForPrevColumn = this.prevColumnWidth + dx;
            this.prevColumn.set('width', this.newWidthForPrevColumn);
			if (this.glow) 
                this.glow.remove();
        } 
        else if (this.blockColumnIndex == 0) { // handle first Column
            //this.blockColumn.set('x', dx);
        }
        else if (this.blockColumnIndex == this.app.BlockColumnsCollection.length - 1) { // handle first Column
            var newWidthForCurColumn = this.curBlockColumnWidth + dx;
            this.blockColumn.set('width', newWidthForCurColumn);
        }
	};

	/*==========  end dragging  ==========*/
	BlockColumnView.prototype.dragEnd = function(x, y, evt) {
        if (this.prevColumn) {
            // updating the width value in the block column width field
            var prevColumnView = this.prevColumn.blockColumnView;
            var blockColumnWidthField = prevColumnView.$('input[name="block-column-width"]')[0];
            blockColumnWidthField.setAttribute('value', this.newWidthForPrevColumn); 
            this.prevColumn = null;
        } else if (this.blockColumnIndex == 0) {
            //this.blockColumn.set('x', x);
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
