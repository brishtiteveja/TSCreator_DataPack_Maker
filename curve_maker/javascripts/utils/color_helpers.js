/* Note: This is just a copy of common/js/utils/color_utils.js that Nag created */
// TODO: Later we will figure out how to merge these makers and utils library...

define([], function() {
  function ColorHelpers(options) {
    options || (options = {});
    _.defaults(options, {
    });
    _.extend(this, options);
  }

  /**
   * Converts the tsc color to css color.
   */
  ColorHelpers.prototype.tscToCssColor = function(color) {
    var rgb = color.split("/");
    return RgbToHex(rgb[0], rgb[1], rgb[2]);
  };

  /**
   * Converts R G B values to CSS color.
   */
  ColorHelpers.prototype.rgbToHex = function(r, g, b) {
    return "#" + ((1 << 24) + (parseInt(r) << 16) + (parseInt(g) << 8) + parseInt(b)).toString(16).slice(1);
  }

  ColorHelpers.prototype.cssToTscColor = function(color) {
    var color = Raphael.getRGB(color);
    return (color.r + "/" + color.g + "/" + color.b);
  }

  return ColorHelpers;
});




