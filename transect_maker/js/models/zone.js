/*============================
=            Zone            =
============================*/

define(["baseModel"], function(BaseModel) {
	var Zone = BaseModel.extend({
		/* Zone is the region between the two blocks. Idea here is that
		the reference column will be converted into zones and the points
		will be drawn relative to the zone they are in */
		
		classname: "Zone",
		constructor: function(attributes, topMarker, baseMarker) {
			/* A zone will have a topMarker and a baseMarker */
			
			var attrs = [{
				edit: false,
				name: attributes.name || _.uniqueId("Zone "),
				description: attributes.description || null,
				topMarker: topMarker,
				baseMarker: baseMarker,
			}];
			BaseModel.apply(this, attrs);
		}
	});

	Zone.prototype.isYInsideZone = function(y) {
		/* Check if the zone contains the point. i.e. the point should lie
		between the topMarker and baseMarker */
		if (this.get('topMarker').get('y') <= y && y < this.get('baseMarker').get('y')) {
			return true;
		}
		return false;
	}

	Zone.prototype.getRelativeY = function(y) {
		if (this.get('topMarker').get('y') <= y && y < this.get('baseMarker').get('y')) {
			var num = ((y - this.get('topMarker').get('y'))/(this.get('baseMarker').get('y') - this.get('topMarker').get('y')))
			return Math.round(num * 100) / 100;
		}
		return null;
	}

	Zone.prototype.getAbsoluteAge = function(y) {
		if (this.get('topMarker').get('y') <= y && y < this.get('baseMarker').get('y') 
			&& this.get('topMarker').get('age') != null && this.get('baseMarker').get('age') != null) {
			var num = ((y - this.get('topMarker').get('y'))/(this.get('baseMarker').get('y') - this.get('topMarker').get('y')))
			age = num * (this.get('baseMarker').get('age') - this.get('topMarker').get('age')) + this.get('topMarker').get('age');
			return Math.round(age * 100) / 100;
		}
		return null;
	}

	return Zone;
});

/*-----  End of Zone  ------*/
