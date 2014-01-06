/*=========================================
=            TransectTextsView            =
=========================================*/

define(["baseView", "transectTextView", "transectText"], function(BaseView, TransectTextView, TransectText) {
	var TransectTextsView = BaseView.extend({
		el: "#texts-list",
		classname: "TransectTextsView"
	});

	TransectTextsView.prototype.template = new EJS({url: '../../../commons/ejs/data_tbl.ejs'});

	TransectTextsView.prototype.initialize = function(app) {
		this.app = app;
		this.transectTexts = this.app.TransectTextsCollection;
		this.enTransectTexts = false;

		this.render();

		this.listenToActionEvents();

		this.listenTo(this.transectTexts, "add", this.render.bind(this));
	}

	TransectTextsView.prototype.render = function() {
		this.$el.html(this.template.render({name: "Transect Texts"}));
		this.$textsList = this.$(".data-list");
		this.renderTransectTexts();
	}

	TransectTextsView.prototype.renderTransectTexts = function() {
		if (this.set == undefined) {
			this.set = this.app.Canvas.set();
		}
		this.transectTexts.each(this.addTransectText.bind(this));
	}

	TransectTextsView.prototype.listenToActionEvents = function() {
		$("#canvas").bind('dblclick', this.createTransectText.bind(this));
	}

	TransectTextsView.prototype.addTransectText = function(transectText) {
		
		var transectTextView = new TransectTextView(this.app, transectText, this);
		this.$textsList.append(transectTextView.el);
		this.set.push(transectTextView.element);
	}

	TransectTextsView.prototype.createTransectText = function(evt) {
		
		if (this.enTransectTexts) {
		
			var transectText = this.transectTexts.findWhere({x: evt.offsetX, y: evt.offsetY}) || new TransectText({x: evt.offsetX, y: evt.offsetY}, this.app);
			
			if (transectText.get('transect') === null || transectText.get('zone') === null) {
				transectText.destroy();
				return;
			}
			
			this.transectTexts.add(transectText);
		}
	}

	TransectTextsView.prototype.toggleTransectTexts = function() {
		if ($("a[href='#add-transect-text']").parent().hasClass('active')) {
			$("a[href='#add-transect-text']").parent().removeClass('active');
			this.enTransectTexts = false;
		} else {
			$("a[href='#add-transect-text']").parent().addClass('active');
			this.enTransectTexts = true;
		}
	}

	return TransectTextsView;
});

/*-----  End of TransectTextsView  ------*/

