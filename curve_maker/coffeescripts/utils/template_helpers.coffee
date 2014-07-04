define [], () ->
  class TemplateHelpers
    truncateIfLong: (str, limit=20, suffix="...") ->
      str = new String(str) unless str.length?
      if str.length > limit
        (str.slice(0, limit-suffix.length) + suffix)
      else
        str
