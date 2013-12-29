/*=======================================================================
=            BaseModel is the base model for all the models.            =
=======================================================================*/
define([], function(){
	var BaseModel = Backbone.Model.extend({
		localStorage: new Backbone.LocalStorage('timescale-creator')
	});

	return BaseModel;
})

/*-----  End of BaseModel  ------*/

