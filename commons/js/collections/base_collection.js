/*=================================================================================================
=            BaseCollection is a collection which is inherited by all the collections.            =
=================================================================================================*/

define([], function() {
	var BaseCollection = Backbone.Collection.extend({
		localStorage: new Backbone.LocalStorage('timescale-creator')
	});

	return BaseCollection;
})

/*-----  End of BaseCollection  ------*/

