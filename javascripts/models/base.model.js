/**
 * This is the base model, which every model will inherit from. This is necessary,
 * as this will help in adding any common attributes to the models.
 */
BaseModel = Backbone.Model.extend({
	localStorage: new Backbone.LocalStorage('timescale-creator')
});
