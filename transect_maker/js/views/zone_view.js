/*================================
=            ZoneView            =
================================*/

var ZoneView = BaseView.extend({
	/* ZoneView is the vie that handles view related to the 
	individual zone. */
	
	tagName: 'tr',
	classname: 'ZoneView'
});

ZoneView.prototype.template = new EJS({url: '/transect_maker/ejs/zone.ejs'});

ZoneView.prototype.initialize = function(zone) {
	this.zone = zone;

	/* render the dom element for the zone in the setting panel */
	this.render();
};

ZoneView.prototype.render = function() {
	this.$el.html(this.template.render(this.zone.toJSON()));
};

/*-----  End of ZoneView  ------*/
