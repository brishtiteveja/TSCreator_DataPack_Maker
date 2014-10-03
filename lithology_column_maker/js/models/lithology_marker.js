/*==============================================================================
=            LithologyMarker to represent the lithology boundaries.            =
==============================================================================*/

define(["baseModel", "lithologys"], function (BaseModel, Lithologys) {

    var LithologyMarker = BaseModel.extend({
        classname: "LithologyMarker",
        constructor: function (attributes, app) {
            var attrs = [{
                name: "TOP",
                edit: false,
                hover: false,
                y: parseInt(attributes.y),
                id: attributes.id || _.uniqueId("lithology-marker-"),
                age: null,
                relativeY: null,
                lithologyGroup: attributes.lithologyGroup || null,
                lithologyGroupMarker: attributes.lithologyGroupMarker || null,
                style: "solid",
                app: app || null,
                zone: null,
                lithologys: new Lithologys(),
            }];
            BaseModel.apply(this, attrs);
        }
    });

    LithologyMarker.prototype.initialize = function () {
        this.updateZone();
    }

    LithologyMarker.prototype.toJSON = function () {
        var json = _.clone(this.attributes);
        delete json["lithologyGroup"];
        delete json["lithologyGroupMarker"];
        delete json["lithologys"];
        delete json["lithologyColumn"];
        delete json["app"];
        return json;
    }

    LithologyMarker.prototype.updateZone = function () {
        var zone = this.get('zone') === null ? this.get('app').ZonesCollection.getZoneForY(this.get('y')) :
            this.get('app').ZonesCollection.getZoneInNeighborhoodForY(this.get('y'), this.get('zone'));

        if (zone !== null) {
            this.set({
                zone: zone
            });
            this.updateRelativeCoordinates();
        }
    }

    LithologyMarker.prototype.updateRelativeCoordinates = function () {
        this.set({
            relativeY: this.get('zone').getRelativeY(this.get('y')),
            age: this.get('zone').getAbsoluteAge(this.get('y'))
        });
    }

    return LithologyMarker;
});

/*-----  End of LithologyMarker to represent the lithology boundaries.  ------*/