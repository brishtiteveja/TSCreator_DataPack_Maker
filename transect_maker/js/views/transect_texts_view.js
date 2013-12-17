/*=========================================
=            TransectTextsView            =
=========================================*/

var TransectTextsView = BaseView.extend({
	el: "#texts-list",
	classname: "TransectTextsView"
});

TransectTextsView.prototype.template = new EJS({url: '../../../commons/ejs/data_tbl.ejs'});

TransectTextsView.prototype.initialize = function() {
	this.transectTexts = transectApp.TransectTextsCollection;
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
		this.set = transectApp.Canvas.set();
	}
	this.transectTexts.each(this.addTransectText.bind(this));
}

TransectTextsView.prototype.listenToActionEvents = function() {
	$("#canvas").bind('dblclick', this.createTransectText.bind(this));
}

TransectTextsView.prototype.addTransectText = function(transectText) {
	var transectTextView = new TransectTextView(transectText, this);
	this.$textsList.append(transectTextView.el);
	this.set.push(transectTextView.element);
}

TransectTextsView.prototype.createTransectText = function(evt) {
	if (this.enTransectTexts) {
		this.transectTexts.add(new TransectText({
			x: evt.offsetX,
			y: evt.offsetY
		}));
	}
}

TransectTextsView.prototype.toggleTransectTexts = function() {
	this.enTransectTexts = !this.enTransectTexts;

}

/*-----  End of TransectTextsView  ------*/

