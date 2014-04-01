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

	ZoneView.prototype.template = new EJS({url: '/commons/ejs/zone.ejs'});

	ZoneView.prototype.initialize = function(zone) {
		this.zone = zone;

		this.listenTo(this.zone, 'change:edit', this.toggleEditStatus.bind(this));
		this.listenTo(this.zone, 'change:name', this.render.bind(this));
		this.listenTo(this.zone, 'change:description', this.render.bind(this));
		this.listenTo(this.zone.get('topMarker'), 'change', this.toggleZone.bind(this));
		this.listenTo(this.zone.get('baseMarker'), 'change', this.toggleZone.bind(this));
		this.listenTo(this.zone, 'destroy', this.delete.bind(this));


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
		this.zone.get('topMarker').set({
			hover: true
		});

		this.zone.get('baseMarker').set({
			hover: true
		});
	};

	ZoneView.prototype.onMouseOut = function() {
		this.$el.removeClass('hover');

		this.zone.get('topMarker').set({
			hover: false
		});
		this.zone.get('baseMarker').set({
			hover: false
		});
	};

	ZoneView.prototype.updateZone = function(evt) {

		if (evt.keyCode == TimescaleApp.ENTER || evt.keyCode == TimescaleApp.ESC) {
			var name = this.$zoneName.value;
			var description = this.$zoneDescription.value.split("\n").join(" ");
			this.zone.set({
				name: name,
				description: description
			});
			this.toggleZoneForm();
		}
	}

	ZoneView.prototype.delete = function() {
		if (this.element !== undefined) this.element.remove();
		this.$el.remove();
		this.remove();
	}

	ZoneView.prototype.destroy = function() {
		this.zone.destroy();
	}

	ZoneView.prototype.toggleZone = function() {
		this.zone.set({
			toggle: !this.zone.get('toggle')
		});
	}

	return ZoneView;
});
/*-----  End of ZoneView  ------*/
