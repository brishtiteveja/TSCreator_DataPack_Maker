var transectApp = transectApp || {};

/*=======================================
=            CursorView            =
=======================================*/

define(["baseView", "cursor"], function(BaseView, Cursor) {

	var CursorView = BaseView.extend({
		el: "#canvas",
		classname: "CursorView",
		events: {
			"keypress": "lock",
			"keyup": "unlock",
		}
	});

	CursorView.prototype.initialize = function() {
		this.cursor = new Cursor();

		transectApp.Cursor = this.cursor;
	};

	CursorView.prototype.lock = function(evt) {
		if (evt.keyCode == transectApp.KEY_1) {
			this.cursor.set({
				lockH: true,
			});
		}
		if (evt.keyCode == transectApp.KEY_2) {
			this.cursor.set({
				lockV: true,
			});
		}
	}

	CursorView.prototype.unlock = function(evt) {
		this.cursor.set({
			lockV: false,
			lockH: false,
		});
	}

	return CursorView;
});

/*-----  End of CursorView  ------*/

