define([], function() {
  function TemplateHelpers(options) {
    options || (options = {});
    _.defaults(options, {
      TRUNCATION_LIMIT: 20,
      TRUNCATION_SUFFIX:"..."
    });
    _.extend(this, options);
  }

  TemplateHelpers.prototype.truncateIfLong = function(str, limit, suffix) {
    if (str == null) { return str; }
    if (limit == null) { limit = this.TRUNCATION_LIMIT; }
    if (suffix == null) { suffix = this.TRUNCATION_SUFFIX; }
    if (str.length == null) { str = new String(str); }
    if (str.length > limit) {
      return str.slice(0, limit - suffix.length) + suffix;
    } else {
      return str;
    }
  };

  return TemplateHelpers;
});
