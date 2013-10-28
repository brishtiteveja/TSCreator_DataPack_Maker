/*=======================================================================
=            BaseModel is the base model for all the models.            =
=======================================================================*/

BaseModel = Backbone.Model.extend({
	localStorage: new Backbone.LocalStorage('timescale-creator')
});

/*-----  End of BaseModel  ------*/

