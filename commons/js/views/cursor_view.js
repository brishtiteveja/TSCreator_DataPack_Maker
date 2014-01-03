var transectApp = transectApp || {};

/*=======================================
=            CursorView            =
=======================================*/

define(["baseView", "cursor"], function(BaseView, Cursor) {

	var CursorView = BaseView.extend({
		el: ".main",
		classname: "CursorView",
		events: {
			"keypress": "togglelock",
			'click a[href="#lock-cursor-h"]': "toggleHlock",
			'click a[href="#lock-cursor-v"]': "toggleVlock"
		}
	});

	CursorView.prototype.initialize = function() {
		this.cursor = new Cursor();
		transectApp.Cursor = this.cursor;
		this.$hLock = this.$('a[href="#lock-cursor-h"]');
		this.$vLock = this.$('a[href="#lock-cursor-v"]');
	};

	CursorView.prototype.togglelock = function(evt) {
		if (evt.keyCode == transectApp.KEY_1) {
			this.toggleHlock();
		}
		if (evt.keyCode == transectApp.KEY_2) {
			this.toggleVlock();
		}
	}

	CursorView.prototype.toggleHlock = function() {
		this.$hLock.parent().toggleClass("active");
		this.cursor.set({
			lockH: !this.cursor.get('lockH'),
		});
	}

	CursorView.prototype.toggleVlock = function() {
		this.$vLock.parent().toggleClass("active");
		this.cursor.set({
			lockV: !this.cursor.get('lockV'),
		});
	}

	return CursorView;
});

/*-----  End of CursorView  ------*/

