/*=======================================
=            CursorView            =
=======================================*/

define(["baseView", "cursor"], function(BaseView, Cursor) {

	var CursorView = BaseView.extend({
		el: ".main",
		classname: "CursorView",
		events: {
			"keypress": "togglelock", // Keys 1 == horizontal lock & 2 == vertical lock.
			'click a[href="#lock-cursor-h"]': "toggleHlock",
			'click a[href="#lock-cursor-v"]': "toggleVlock"
		}
	});

	CursorView.prototype.initialize = function(app) {
		this.app = app;
		this.cursor = new Cursor();
		this.app.Cursor = this.cursor;
		this.$hLock = this.$('a[href="#lock-cursor-h"]');
		this.$vLock = this.$('a[href="#lock-cursor-v"]');
	};

	CursorView.prototype.togglelock = function(evt) {
		if (evt.keyCode == TimescaleApp.KEY_MINUS) {
			this.toggleHlock();
		}
		if (evt.keyCode == TimescaleApp.KEY_EQUAL) {
			this.toggleVlock();
		}
	}

	CursorView.prototype.toggleHlock = function() {
		if (this.$vLock.parent().hasClass("active")) {
			this.toggleVlock();
		}
		this.$hLock.parent().toggleClass("active");
		this.cursor.set({
			lockH: !this.cursor.get('lockH'),
		});
	}

	CursorView.prototype.toggleVlock = function() {
		if (this.$hLock.parent().hasClass("active")) {
			this.toggleHlock();
		}
		this.$vLock.parent().toggleClass("active");
		this.cursor.set({
			lockV: !this.cursor.get('lockV'),
		});
	}

	return CursorView;
});

/*-----  End of CursorView  ------*/

