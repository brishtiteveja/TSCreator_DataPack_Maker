/*=======================================================================
=            BaseModel is the base model for all the models.            =
=======================================================================*/
define([], function() {
	var BaseModel = Backbone.Model.extend({
		sync: function() {
			return false;
		}
	});

	_.extend(this.Backbone.Events);

	BaseModel.prototype.update = function() {
		this.trigger('update');
	}

    BaseModel.prototype.toggle = function() {
        this.trigger('toggle');
    }

    BaseModel.prototype.delete = function() {
        this.trigger('delete');
    }

	return BaseModel;
})

/*-----  End of BaseModel  ------*/