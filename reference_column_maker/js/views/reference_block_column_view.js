
/*========================================
=            ReferenceBlockColumnView            =
========================================*/

define(["baseView", "referenceBlockView", "referenceBlockMarkerView", "referenceBlock", "referenceBlockMarker"], function(BaseView, ReferenceBlockView, ReferenceBlockMarkerView, ReferenceBlock, ReferenceBlockMarker) {

	var ReferenceBlockColumnView = BaseView.extend({
		tagName: "li",
		classname: "ReferenceBlockColumnView",
		events: {
			'click .toggle': 'ReferencetoggleBlockColumnForm',
			'click .block-column-data': 'ReferencetoggleBlockColumnForm',
			'click .destroy': 'destroy',
			'click label.block-column-blocks-data': 'showBlocksList',
			'keypress :input': 'ReferenceupdateBlockColumn',
			'keyup :input': 'ReferenceupdateBlockColumn',
			'change input[name="block-column-bg-color"]': 'ReferenceupdateBlockColumn',
			'mouseover': "onMouseOver",
			'mouseout': "onMouseOut",
		}
	});

	ReferenceBlockColumnView.prototype.template = new EJS({url: '/reference_column_maker/ejs/block_column.ejs'});

	ReferenceBlockColumnView.prototype.initialize = function(app, blockColumn) {
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

	ReferenceBlockColumnView.prototype.render = function() {
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
	}

	ReferenceBlockColumnView.prototype.renderBlockColumn = function() {
		if (this.element === undefined) {
			this.element = this.app.Paper.rect(this.blockColumn.get('x'), 0, this.blockColumn.get('width'), this.app.Paper.height);

			/* attach listeners to the element */
			this.element.dblclick(this.createBlockMarker.bind(this));

			this.app.MarkersSet.toFront();
		}

		this.element.attr({
			x: this.blockColumn.get('x'),
			width: this.blockColumn.get('width'),
			height: this.blockColumn.get('height'),
			fill: this.blockColumn.get('settings').get('backgroundColor')
		});

		this.resizePaper();
		this.updateBlockColumns();
	}

	ReferenceBlockColumnView.prototype.resizePaper = function() {
		var width = Math.max(this.app.Paper.width, this.blockColumn.get('x') + this.blockColumn.get('width'));
		this.app.Paper.setSize(width, this.app.Paper.height);
	}

	ReferenceBlockColumnView.prototype.resetBlocks = function() {
		this.$blocksList.html('');
		this.blockColumn.get('blocks').each(this.addBlock.bind(this));
	}

	ReferenceBlockColumnView.prototype.ReferencerenderBlocks = function() {
		this.blockColumn.get('blocks').each(this.addBlockMarker.bind(this));
	}

	ReferenceBlockColumnView.prototype.ReferencetoggleBlockColumnForm = function() {
		this.renderBlockColumn();
		this.blockColumn.set({
			'edit': !this.blockColumn.get('edit')
		});
	}

	ReferenceBlockColumnView.prototype.editBlockColumn = function() {
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

	ReferenceBlockColumnView.prototype.delete = function() {
		if (this.element !== undefined) this.element.remove();
		this.$el.remove();
		this.remove();
	}


	ReferenceBlockColumnView.prototype.ReferenceupdateBlockColumn = function(evt) {
		
		if (evt.keyCode == 13) {
			this.ReferencetoggleBlockColumnForm();
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

	ReferenceBlockColumnView.prototype.createBlockMarker = function(evt) {
		if (!this.app.enBlocks) return;
		var blockMarker = new ReferenceBlockMarker({y: evt.offsetY, blockColumn: this.blockColumn}, this.app);
		this.blockColumn.get('blockMarkers').add(blockMarker);
	}

	ReferenceBlockColumnView.prototype.addBlockMarker = function(blockMarker) {
		var blockMarkerView = new ReferenceBlockMarkerView(this.app, blockMarker);

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
						new ReferenceBlock({top: topMarker, base: baseMarker, blockColumn: self.blockColumn});
			topMarker.get('blocks').add(block);
			baseMarker.get('blocks').add(block);
			baseMarker.set({
				name: block.get('name') + " Base"
			});
			blocks.add(block);
		}
	}

	ReferenceBlockColumnView.prototype.removeBlock = function(block) {
		var topMarker = block.get('top');
		var baseMarker = block.get('top');
	}

	ReferenceBlockColumnView.prototype.addBlock = function(block) {
		var blockView = new ReferenceBlockView(this.app, block);
		this.$blocksList.append(blockView.el);
	}

	ReferenceBlockColumnView.prototype.updateBlockColumns = function() {
		var self = this;
		if (!this.app.ReferenceBlockColumnsCollection) {
			return;
		}
		var stratIndex = this.app.ReferenceBlockColumnsCollection.indexOf(this.blockColumn);
		this.app.ReferenceBlockColumnsCollection.each(function(blockColumn, index) {
			if (index > stratIndex) {
				var prevColumn = self.app.ReferenceBlockColumnsCollection.at(index - 1);
				var x = prevColumn.get('x') + prevColumn.get('width');
				blockColumn.set({
					x: x
				});
			}
		});
	}

	ReferenceBlockColumnView.prototype.showBlocksList = function() {
		if (this.$blocksList.hasClass('hide')) {
			this.$blocksList.removeClass('hide');
		} else {
			this.$blocksList.addClass('hide');
		}
	}

	ReferenceBlockColumnView.prototype.delete = function() {
		_.invoke(this.blockColumn.get('blocks').toArray(), "destroy");
		if (this.element) this.element.remove();
		this.$el.remove();
		this.remove();
	}

	ReferenceBlockColumnView.prototype.destroy = function() {
		this.blockColumn.destroy();
	}

	return ReferenceBlockColumnView;
});

/*-----  End of ReferenceBlockColumnView  ------*/
