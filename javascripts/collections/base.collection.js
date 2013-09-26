BaseCollection = Backbone.Collection.extend({
	localStorage: new Backbone.LocalStorage('timescale-creator')
});