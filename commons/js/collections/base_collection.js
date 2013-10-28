/*=================================================================================================
=            BaseCollection is a collection which is inherited by all the collections.            =
=================================================================================================*/

BaseCollection = Backbone.Collection.extend({
	localStorage: new Backbone.LocalStorage('timescale-creator')
});

/*-----  End of BaseCollection  ------*/

