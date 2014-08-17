/*================================================================================================================================================================
=            This is the base view, which every view will inherit. This is necessary, as this will help in adding any common attributes to the views.            =
================================================================================================================================================================*/

define([], function () {
    var BaseView = Backbone.View.extend({});

    BaseView.prototype.wrapString = function (str, width, brk, cut) {
        brk = brk || '\n';
        width = width || 75;
        cut = cut || false;

        if (!str) {
            return str;
        }

        var regex = '.{1,' + width + '}(\\s|$)' + (cut ? '|.{' + width + '}|.+$' : '|\\S+?(\\s|$)');

        return str.match(RegExp(regex, 'g')).join(brk);
    }

    BaseView.prototype.toggleForm = function () {
        this.$pointForm.toggleClass('hide');
        this.$pointData.toggleClass('hide');
        this.$toggle.toggleClass('hide-data');
        this.$toggle.toggleClass('show-data');
    }

    return BaseView;
});

/*-----  End of BaseView  ------*/