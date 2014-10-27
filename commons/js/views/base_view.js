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

    BaseView.prototype.base64ToBinary = function (imgUrl) {
        var BASE64_MARKER = ';base64,';
        var base64Index = imgUrl.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
        var base64 = imgUrl.substring(base64Index);
        var raw = window.atob(base64);
        var rawLength = raw.length;
        var array = new Uint8Array(new ArrayBuffer(rawLength));

        for (i = 0; i < rawLength; ++i) {
            array[i] = raw.charCodeAt(i);
        }
        return array;
    };

    return BaseView;
});