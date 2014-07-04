(function() {
  define([], function() {
    var TemplateHelpers;
    return TemplateHelpers = (function() {
      function TemplateHelpers() {}

      TemplateHelpers.prototype.truncateIfLong = function(str, limit, suffix) {
        if (limit == null) {
          limit = 20;
        }
        if (suffix == null) {
          suffix = "...";
        }
        if (str.length == null) {
          str = new String(str);
        }
        if (str.length > limit) {
          return str.slice(0, limit - suffix.length) + suffix;
        } else {
          return str;
        }
      };

      return TemplateHelpers;

    })();
  });

}).call(this);
