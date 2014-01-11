
/*===============================================================================================================
=            BlockView is the view that handles changes to the block column it is instantiated with.            =
===============================================================================================================*/

define(["baseView"], function(BaseView) {
	
	var BlockView = BaseView.extend({
		tagName: 'li',
		classname: "BlockView",
		events: {
		}
	});

	BlockView.prototype.template = new EJS({url: '/block_column_maker/ejs/block.ejs'});

	BlockView.prototype.initialize = function(app, block) {
		this.app = app;
		this.block = block;

		this.render();
	};

	BlockView.prototype.render = function() {
		this.$el.html(this.template.render(this.block.toJSON()));

		this.renderBlock();
	};

	BlockView.prototype.renderBlock = function() {

		if (this.element === undefined) {
			this.element = this.app.Canvas.path();
			this.element.attr({
				"stroke-width": 2,
				"stroke": "#900000"
			});
		}

		this.element.attr({
			path: this.getPath()
		});
	}

	BlockView.prototype.getPath = function() {
		var x2 = this.block.get('blockColumn').get('x') + this.block.get('blockColumn').get('width');
		return "M" + this.block.get('blockColumn').get('x') + "," + this.block.get('y') + "H" + x2;
	}

	return BlockView;
});

/*-----  End of BlockView  ------*/
