/*================================
=            ZoneView            =
================================*/

define(["baseView"], function(BaseView) {
	var ZoneView = BaseView.extend({
		/* ZoneView is the vie that handles view related to the 
		individual zone. */
		tagName: 'li',
		classname: 'ZoneView',
		events: {
			'click .toggle': 'toggleZoneForm',
			'click .zone-data': 'toggleZoneForm',
			'keypress :input': 'updateZone',
			'keyup :input': 'updateZone',
			'mouseover': "onMouseOver",
			'mouseout': "onMouseOut",
		}
	});

	ZoneView.prototype.template = new EJS({url: '../../../transect_maker/ejs/zone.ejs'});

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
		this.$zoneDescription = this.$('textarea[name="zone-description"]')[0];

	};

	ZoneView.prototype.toggleZoneForm = function() {
		this.render();
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

	ZoneView.prototype.onMouseOver = function() {
		this.$el.addClass('hover');
	};

	ZoneView.prototype.onMouseOut = function() {
		this.$el.removeClass('hover');
	};

	ZoneView.prototype.updateZone = function(evt) {

		if (evt.keyCode == 13) {
			this.toggleZoneForm();
		}

		var name = this.$zoneName.value;
		var description = this.$zoneDescription.value;
		this.zone.set({
			name: name,
			description: description
		});
	}

	return ZoneView;
});
/*-----  End of ZoneView  ------*/
