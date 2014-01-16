/*===================================
=            Point Model            =
===================================*/

define(["baseModel"], function(BaseModel) {
	var Point = BaseModel.extend({
		classname: "Point",
		constructor: function(attributes, app) {
			var attrs = [{
				edit: false,
				name: attributes.name || _.uniqueId("X"),
				x: attributes.x ? parseInt(attributes.x) : 0,
				y: attributes.y ? parseInt(attributes.y) : 0,
				age: 0,
				relativeX: null,
				relativeY: null,
				transect: null,
				zone: null,
				app: app
			}];
			BaseModel.apply(this, attrs);
		}
	});

	Point.prototype.initialize = function(attributes, app) {
		this.updateTransectAndZone();
	};

	Point.prototype.updateTransectAndZone = function() {
		var zone = this.get('app').ZonesCollection.getZoneForY(this.get('y'));
		var transect = this.get('app').TransectsCollection.getTransectForX(this.get('x'));

		if (zone === null) {
			zone = this.get('app').ZonesCollection.getZoneForY(this.get('y') - 1);
			if (zone === null) {
				zone = this.get('app').ZonesCollection.getZoneForY(this.get('y') + 1);
				if (zone !== null) {
					this.set({
						y: this.get('y') + 1
					});
				}
			} else {
				this.set({
					y: this.get('y') - 1
				});
			}
		}

		if (transect === null) {
			transect = this.get('app').TransectsCollection.getTransectForX(this.get('x') + 1);
			if (transect === null){
				transect = this.get('app').TransectsCollection.getTransectForX(this.get('x') - 1);
				if (transect !== null) {
					this.set({
						x: this.get('x') - 1
					});
				}
			} else {
				this.set({
					x: this.get('x') + 1
				});
			}
		}

		if (zone !== null && transect !== null) {
			this.set({
				transect: transect,
				zone: zone
			});	
			this.updateRelativeCoordinates();
		}
	}

	Point.prototype.updateRelativeCoordinates = function() {
		this.set({
			relativeX: this.get('transect').getRelativeX(this.get('x')),
			relativeY: this.get('zone').getRelativeY(this.get('y')),
			age: this.get('zone').getAbsoluteAge(this.get('y'))
		});
	}

	Point.prototype.toJSON = function() {
		var json = _.clone(this.attributes);
		delete json["transect"];
		delete json["zone"];
		delete json["app"];
		return json;
	}

	Point.prototype.toStatusJSON = function() {
		var json = _.clone(this.attributes);
		return json;
	}

	return Point;
});
/*-----  End of Point Model  ------*/
