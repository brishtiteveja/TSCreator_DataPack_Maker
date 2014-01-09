var transectApp = transectApp || {};
transectApp.VERTICAL_SCALE = 1;
transectApp.PIX_PER_MY = 30;
transectApp.WIDTH = 500;
transectApp.polygonFill = "#FFFF33";
transectApp.glowColor = "#0000CC";
transectApp.renderFill = "#66FF66";
transectApp.lineMouseOver = "#FF0000 ";
transectApp.lineMouseOut = "#000000";
transectApp.precision = 5; // rounding of to nearest percentage.
transectApp.steps = Math.round(100/transectApp.precision);

// fonts 
transectApp.fonts = [
	'Georgia, serif',
	'"Palatino Linotype", "Book Antiqua", Palatino, serif',
	'"Times New Roman", Times, serif',
	'Arial, Helvetica, sans-serif',
	'"Arial Black", Gadget, sans-serif',
	'"Comic Sans MS", cursive, sans-serif',
	'Impact, Charcoal, sans-serif',
	'"Lucida Sans Unicode", "Lucida Grande", sans-serif',
	'Tahoma, Geneva, sans-serif',
	'"Trebuchet MS", Helvetica, sans-serif',
	'Verdana, Geneva, sans-serif',
	'"Courier New", Courier, monospace',
	'"Lucida Console", Monaco, monospace',
]