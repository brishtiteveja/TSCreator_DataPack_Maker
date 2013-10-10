/*====================================
=            TransectView            =
====================================*/

var TransectView = BaseView.extend({
  tagName: 'tr',
  classname: 'TransectView'
});

TransectView.prototype.template = new EJS({url: '/html/templates/transect.ejs'});

TransectView.prototype.initialize = function(transect) {
  this.transect = transect;

  /* render the dom element in the settings */
  this.render();
};

TransectView.prototype.render = function() {
  this.$el.html(this.template.render(this.transect.toJSON()));
};

/*-----  End of TransectView  ------*/
