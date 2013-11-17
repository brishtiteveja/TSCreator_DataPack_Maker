/*================================
=            ZoneView            =
================================*/

var ZoneView = BaseView.extend({
	/* ZoneView is the vie that handles view related to the 
	individual zone. */
	tagName: 'tr',
	classname: 'ZoneView',
	events: {
		'click .toggle': 'toggleZoneForm',
		'click a.update': 'updateZone'
	}
});

ZoneView.prototype.template = new EJS({url: '/transect_maker/ejs/zone.ejs'});

ZoneView.prototype.initialize = function(zone) {
	this.zone = zone;

	this.listenTo(this.zone, 'change:edit', this.toggleEditStatus.bind(this));

	/* render the dom element for the zone in the setting panel */
	this.render();
};

ZoneView.prototype.render = function() {
	this.$el.html(this.template.render(this.zone.toJSON()));

	this.$toggle = this.$(".toggle");
	this.$zoneForm = this.$(".zone-form");
	this.$zoneData = this.$(".zone-data");
	this.$zoneName = this.$('input[name="zone-name"]')[0];

};

ZoneView.prototype.toggleZoneForm = function() {
	this.zone.set({
		'edit': !this.zone.get('edit')
	});
};

ZoneView.prototype.toggleEditStatus = function() {
	if (this.zone.get('edit')) {
		this.$zoneForm.removeClass('hide');
		this.$zoneData.addClass('hide');
		this.$toggle.removeClass('hide-data');
		this.$toggle.addClass('show-data');
	} else {
		this.$zoneForm.addClass('hide');
		this.$zoneData.removeClass('hide');
		this.$toggle.removeClass('show-data');
		this.$toggle.addClass('hide-data');
	}
}

ZoneView.prototype.updateZone = function() {
}

/*-----  End of ZoneView  ------*/
