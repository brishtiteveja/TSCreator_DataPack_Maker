from xml.dom import minidom

svg_file = "Color_SwatchesTSC_Nov2011.svg"

doc = minidom.parse(svg_file)  # parseString also exists
path_strings = [path.getAttribute('id')  for path
                in doc.getElementsByTagName('pattern')]
doc.unlink()

print path_strings
